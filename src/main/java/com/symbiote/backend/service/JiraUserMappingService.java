package com.symbiote.backend.service;

import com.symbiote.backend.entity.JiraUserMapping;
import com.symbiote.backend.repository.JiraUserMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JiraUserMappingService {
    private final JiraUserMappingRepository repository;

    public JiraUserMapping getOrThrowBySymbioteUser(Long userId) {
        return repository.findBySymbioteUserId(userId)
                .orElseThrow(() -> new IllegalStateException("No Jira mapping for user: " + userId));
    }

    public JiraUserMapping getOrNullByJiraAccountId(String accountId) {
        return repository.findByJiraAccountId(accountId).orElse(null);
    }

    public JiraUserMapping create(Long userId, String jiraAccountId, String source, String displayName) {
        return repository.save(JiraUserMapping.builder()
                .id(UUID.randomUUID())
                .symbioteUserId(userId)
                .jiraAccountId(jiraAccountId)
                .source(source)
                .displayName(displayName)
                .createdAt(Instant.now())
                .build());
    }

    public List<JiraUserMapping> getAllMappings() {
        return repository.findAll();
    }

    public void deleteMapping(Long userId) {
        repository.findBySymbioteUserId(userId).ifPresent(repository::delete);
    }
}
