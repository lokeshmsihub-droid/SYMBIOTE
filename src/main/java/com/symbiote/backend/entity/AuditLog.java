package com.symbiote.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action; // e.g. TASK_CREATED, USER_MAPPED

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String actorEmail; // User who performed the action

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public AuditLog() {}

    public AuditLog(Long id, String action, String description, String actorEmail, Instant createdAt) {
        this.id = id;
        this.action = action;
        this.description = description;
        this.actorEmail = actorEmail;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static AuditLogBuilder builder() {
        return new AuditLogBuilder();
    }

    public static class AuditLogBuilder {
        private Long id;
        private String action;
        private String description;
        private String actorEmail;
        private Instant createdAt;

        public AuditLogBuilder id(Long id) { this.id = id; return this; }
        public AuditLogBuilder action(String action) { this.action = action; return this; }
        public AuditLogBuilder description(String description) { this.description = description; return this; }
        public AuditLogBuilder actorEmail(String actorEmail) { this.actorEmail = actorEmail; return this; }
        public AuditLogBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public AuditLog build() {
            return new AuditLog(id, action, description, actorEmail, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
