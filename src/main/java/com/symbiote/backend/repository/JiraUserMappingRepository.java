package com.symbiote.backend.repository;

import com.symbiote.backend.entity.JiraUserMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JiraUserMappingRepository extends JpaRepository<JiraUserMapping, UUID> {
    Optional<JiraUserMapping> findBySymbioteUserId(Long symbioteUserId);
    Optional<JiraUserMapping> findByJiraAccountId(String jiraAccountId);
}
