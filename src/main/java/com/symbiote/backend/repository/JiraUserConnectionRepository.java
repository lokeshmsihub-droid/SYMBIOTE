package com.symbiote.backend.repository;

import com.symbiote.backend.entity.JiraUserConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JiraUserConnectionRepository extends JpaRepository<JiraUserConnection, UUID> {
    Optional<JiraUserConnection> findByUserId(Long userId);
    Optional<JiraUserConnection> findByJiraAccountId(String jiraAccountId);
    void deleteByUserId(Long userId);
}
