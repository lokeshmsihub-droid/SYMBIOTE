package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "events", indexes = {
        @Index(name = "idx_events_user_time", columnList = "userId,occurredAt"),
        @Index(name = "idx_events_idem", columnList = "idempotencyKey", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID eventId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Instant occurredAt;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;

    @Column(nullable = false, unique = true, length = 128)
    private String idempotencyKey;

    @Column
    private Instant processedAt;
}
