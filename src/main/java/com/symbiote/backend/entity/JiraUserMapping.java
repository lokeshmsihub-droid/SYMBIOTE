package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "jira_user_mapping", uniqueConstraints = {
        @UniqueConstraint(name = "uq_jira_user_mapping", columnNames = {"symbioteUserId", "jiraAccountId"})
})
public class JiraUserMapping {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private Long symbioteUserId;

    @Column(nullable = false, unique = true)
    private String jiraAccountId;

    @Column(nullable = false)
    private String source; // MANUAL, OAUTH

    private String displayName;

    @Column(nullable = false)
    private Instant createdAt;

    public JiraUserMapping() {}

    public JiraUserMapping(UUID id, Long symbioteUserId, String jiraAccountId, String source, String displayName, Instant createdAt) {
        this.id = id;
        this.symbioteUserId = symbioteUserId;
        this.jiraAccountId = jiraAccountId;
        this.source = source != null ? source : "MANUAL";
        this.displayName = displayName;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static JiraUserMappingBuilder builder() {
        return new JiraUserMappingBuilder();
    }

    public static class JiraUserMappingBuilder {
        private UUID id;
        private Long symbioteUserId;
        private String jiraAccountId;
        private String source;
        private String displayName;
        private Instant createdAt;

        public JiraUserMappingBuilder id(UUID id) { this.id = id; return this; }
        public JiraUserMappingBuilder symbioteUserId(Long symbioteUserId) { this.symbioteUserId = symbioteUserId; return this; }
        public JiraUserMappingBuilder jiraAccountId(String jiraAccountId) { this.jiraAccountId = jiraAccountId; return this; }
        public JiraUserMappingBuilder source(String source) { this.source = source; return this; }
        public JiraUserMappingBuilder displayName(String displayName) { this.displayName = displayName; return this; }
        public JiraUserMappingBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public JiraUserMapping build() {
            return new JiraUserMapping(id, symbioteUserId, jiraAccountId, source, displayName, createdAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Long getSymbioteUserId() { return symbioteUserId; }
    public void setSymbioteUserId(Long symbioteUserId) { this.symbioteUserId = symbioteUserId; }
    public String getJiraAccountId() { return jiraAccountId; }
    public void setJiraAccountId(String jiraAccountId) { this.jiraAccountId = jiraAccountId; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
