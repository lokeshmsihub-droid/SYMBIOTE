package com.symbiote.backend.service;

import com.symbiote.backend.entity.JiraWebhookEvent;
import com.symbiote.backend.entity.UnmappedWebhookEvent;
import com.symbiote.backend.entity.User;
import com.symbiote.backend.repository.UserRepository;
import com.symbiote.backend.repository.JiraWebhookEventRepository;
import com.symbiote.backend.repository.UnmappedWebhookEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JiraWebhookService {

    private final UserRepository userRepository;
    private final JiraWebhookEventRepository webhookEventRepository;
    private final UnmappedWebhookEventRepository unmappedRepository;
    private final JiraMappingResolver mappingResolver;

    @Transactional
    public void handleWebhook(Map<String, Object> payload) {
        String issueKey = extractIssueKey(payload);
        String jiraAccountId = extractAssigneeAccountId(payload);
        String status = extractStatus(payload);
        String updatedAt = extractUpdatedAt(payload);
        
        // 1. Idempotency Key (IssueKey + Status + UpdatedAt)
        String idempotencyKey = issueKey + ":" + (status != null ? status : "unknown") + ":" + updatedAt;
        
        if (webhookEventRepository.findByIdempotencyKey(idempotencyKey).isPresent()) {
            log.info("Duplicate webhook event (Key: {}). Skipping.", idempotencyKey);
            return;
        }

        // 2. Initial Log
        JiraWebhookEvent event = JiraWebhookEvent.builder()
                .id(UUID.randomUUID())
                .idempotencyKey(idempotencyKey)
                .status("PENDING")
                .payload(payload.toString())
                .receivedAt(Instant.now())
                .build();
        webhookEventRepository.save(event);

        try {
            if (jiraAccountId == null) {
                log.warn("Webhook issue {} has no assignee.", issueKey);
                event.setStatus("SKIPPED_NO_ASSIGNEE");
                webhookEventRepository.save(event);
                return;
            }

            // 3. Resolve User
            mappingResolver.resolveUserId(jiraAccountId).ifPresentOrElse(userId -> {
                userRepository.findById(userId).ifPresentOrElse(user -> {
                    processUserXp(user, status, event);
                }, () -> {
                    log.error("Resolved user ID {} not found in SYMBIOTE DB", userId);
                    event.setStatus("FAILED_USER_NOT_FOUND");
                });
            }, () -> {
                log.info("No mapping for Jira Account ID: {}. Logging to unmapped queue.", jiraAccountId);
                logUnmappedEvent(jiraAccountId, payload);
                event.setStatus("UNMAPPED");
            });

        } catch (Exception e) {
            log.error("Internal error processing webhook for issue {}: {}", issueKey, e.getMessage());
            event.setStatus("FAILED");
        }
        
        webhookEventRepository.save(event);
    }

    private void processUserXp(User user, String status, JiraWebhookEvent event) {
        int points = calculateXp(status);
        if (points != 0) {
            user.setLifetimeXp(user.getLifetimeXp() + points);
            user.setWeeklyXp(user.getWeeklyXp() + (points > 0 ? points : 0)); // Weekly XP usually doesn't go below 0
            userRepository.save(user);
            log.info("Awarded {} XP to user {} for status {}. New Total: {}", points, user.getEmail(), status, user.getLifetimeXp());
        }
        event.setStatus("SUCCESS");
    }

    private int calculateXp(String status) {
        if (status == null) return 0;
        String s = status.toUpperCase();
        if (s.contains("DONE") || s.contains("CLOSED") || s.contains("RESOLVED")) return 50;
        if (s.contains("IN PROGRESS")) return 10;
        if (s.contains("REOPENED")) return -20;
        return 0;
    }

    private void logUnmappedEvent(String jiraAccountId, Map<String, Object> payload) {
        unmappedRepository.save(UnmappedWebhookEvent.builder()
                .jiraAccountId(jiraAccountId)
                .payload(payload.toString())
                .build());
    }

    private String extractIssueKey(Map<String, Object> payload) {
        Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
        return issue != null ? (String) issue.get("key") : "unknown";
    }

    private String extractStatus(Map<String, Object> payload) {
        try {
            Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
            Map<String, Object> fields = (Map<String, Object>) issue.get("fields");
            Map<String, Object> status = (Map<String, Object>) fields.get("status");
            return (String) status.get("name");
        } catch (Exception e) {
            return null;
        }
    }

    private String extractAssigneeAccountId(Map<String, Object> payload) {
        try {
            Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
            Map<String, Object> fields = (Map<String, Object>) issue.get("fields");
            Map<String, Object> assignee = (Map<String, Object>) fields.get("assignee");
            return (String) assignee.get("accountId");
        } catch (Exception e) {
            return null;
        }
    }

    private String extractUpdatedAt(Map<String, Object> payload) {
        try {
            Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
            Map<String, Object> fields = (Map<String, Object>) issue.get("fields");
            return (String) fields.get("updated");
        } catch (Exception e) {
            return String.valueOf(Instant.now().toEpochMilli());
        }
    }
}
