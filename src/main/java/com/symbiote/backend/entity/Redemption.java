package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "redemptions", indexes = {
        @Index(name = "idx_redemptions_user", columnList = "userId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Redemption {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private UUID rewardId;

    @Column(nullable = false)
    private long cost;

    @Column(nullable = false)
    private Instant createdAt;
}
