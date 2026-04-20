package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "jira_webhook_event", indexes = {
        @Index(name = "idx_jira_webhook_idem", columnList = "idempotencyKey", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JiraWebhookEvent {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 128)
    private String idempotencyKey;

    @Column(nullable = false)
    private String issueKey;

    @Column(nullable = false)
    private String eventType;

    @Column(nullable = false)
    private Instant receivedAt;
}
