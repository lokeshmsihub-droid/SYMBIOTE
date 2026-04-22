package com.symbiote.backend.service;

import com.symbiote.backend.entity.JiraUserConnection;
import com.symbiote.backend.entity.JiraUserMapping;
import com.symbiote.backend.repository.JiraUserConnectionRepository;
import com.symbiote.backend.repository.JiraUserMappingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class JiraMappingResolver {

    private final JiraUserConnectionRepository connectionRepository;
    private final JiraUserMappingRepository mappingRepository;

    /**
     * Resolves a Jira Account ID to a Symbiote User ID.
     * Priority: OAuth Connection > Manual Mapping.
     */
    public Optional<Long> resolveUserId(String jiraAccountId) {
        // 1. Check OAuth Connections
        Optional<JiraUserConnection> connection = connectionRepository.findByJiraAccountId(jiraAccountId);
        if (connection.isPresent()) {
            return Optional.of(connection.get().getUserId());
        }

        // 2. Check Manual Mappings
        Optional<JiraUserMapping> mapping = mappingRepository.findByJiraAccountId(jiraAccountId);
        if (mapping.isPresent()) {
            return Optional.of(mapping.get().getSymbioteUserId());
        }

        log.debug("No mapping found for Jira Account ID: {}", jiraAccountId);
        return Optional.empty();
    }
}
