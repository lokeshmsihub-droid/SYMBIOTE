package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "jira_webhook_events", indexes = {
    @Index(name = "idx_webhook_idempotency", columnList = "idempotencyKey")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JiraWebhookEvent {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String idempotencyKey; // issueId + transitionId or timestamp

    @Column(nullable = false)
    private String status; // PENDING, SUCCESS, FAILED

    private Integer retryCount;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false)
    private Instant receivedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (receivedAt == null) receivedAt = Instant.now();
        if (retryCount == null) retryCount = 0;
    }
}
