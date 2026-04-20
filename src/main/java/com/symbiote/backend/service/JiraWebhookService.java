package com.symbiote.backend.service;

import com.symbiote.backend.config.JiraConfig;
import com.symbiote.backend.dto.EventRequest;
import com.symbiote.backend.entity.JiraUserMapping;
import com.symbiote.backend.entity.JiraWebhookEvent;
import com.symbiote.backend.repository.JiraWebhookEventRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JiraWebhookService {
    private static final Logger log = LoggerFactory.getLogger(JiraWebhookService.class);

    private final JiraWebhookEventRepository webhookEventRepository;
    private final JiraUserMappingService mappingService;
    private final EventService eventService;
    private final JiraConfig jiraConfig;

    @Transactional
    public void handleWebhook(Map<String, Object> payload) {
        String issueKey = extractIssueKey(payload);
        String status = extractStatus(payload);
        String accountId = extractAssignee(payload);
        Integer storyPoints = extractStoryPoints(payload);
        String eventType = String.valueOf(payload.getOrDefault("webhookEvent", "issue_updated"));

        String idempotencyKey = issueKey + ":" + status + ":" + eventType + ":" + extractUpdatedAt(payload);
        if (webhookEventRepository.findByIdempotencyKey(idempotencyKey).isPresent()) {
            return;
        }

        webhookEventRepository.save(JiraWebhookEvent.builder()
                .id(UUID.randomUUID())
                .idempotencyKey(idempotencyKey)
                .issueKey(issueKey)
                .eventType(eventType)
                .receivedAt(Instant.now())
                .build());

        if (accountId == null) {
            log.warn("Webhook issue {} has no assignee", issueKey);
            return;
        }

        JiraUserMapping mapping = mappingService.getOrNullByJiraAccountId(accountId);
        if (mapping == null) {
            log.warn("No symbiote mapping for Jira account {}", accountId);
            return;
        }

        EventRequest event = new EventRequest();
        event.setUserId(mapping.getSymbioteUserId());
        event.setOccurredAt(Instant.now());
        event.setMetadata(Map.of("storyPoints", storyPoints == null ? 0 : storyPoints, "issueKey", issueKey, "status", status));
        event.setIdempotencyKey(idempotencyKey);
        event.setType(mapStatusToEventType(status));

        eventService.createEvent(event);
    }

    private String mapStatusToEventType(String status) {
        if (status == null) return "TASK_UPDATED";
        return switch (status.toLowerCase()) {
            case "done", "closed", "resolved" -> "TASK_COMPLETED";
            case "in progress" -> "TASK_STARTED";
            case "to do" -> "TASK_ASSIGNED";
            default -> "TASK_UPDATED";
        };
    }

    private String extractIssueKey(Map<String, Object> payload) {
        Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
        return issue != null ? String.valueOf(issue.get("key")) : "unknown";
    }

    private String extractStatus(Map<String, Object> payload) {
        Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
        if (issue == null) return null;
        Map<String, Object> fields = (Map<String, Object>) issue.get("fields");
        if (fields == null) return null;
        Map<String, Object> status = (Map<String, Object>) fields.get("status");
        return status != null ? String.valueOf(status.get("name")) : null;
    }

    private String extractAssignee(Map<String, Object> payload) {
        Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
        if (issue == null) return null;
        Map<String, Object> fields = (Map<String, Object>) issue.get("fields");
        if (fields == null) return null;
        Map<String, Object> assignee = (Map<String, Object>) fields.get("assignee");
        return assignee != null ? String.valueOf(assignee.get("accountId")) : null;
    }

    private Integer extractStoryPoints(Map<String, Object> payload) {
        Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
        if (issue == null) return null;
        Map<String, Object> fields = (Map<String, Object>) issue.get("fields");
        if (fields == null) return null;
        Object value = fields.get(jiraConfig.getStoryPointsField());
        if (value instanceof Number) return ((Number) value).intValue();
        return null;
    }

    private String extractUpdatedAt(Map<String, Object> payload) {
        Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
        if (issue == null) return String.valueOf(System.currentTimeMillis());
        Map<String, Object> fields = (Map<String, Object>) issue.get("fields");
        if (fields == null) return String.valueOf(System.currentTimeMillis());
        Object updated = fields.get("updated");
        return updated != null ? String.valueOf(updated) : String.valueOf(System.currentTimeMillis());
    }
}
