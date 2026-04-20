package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ledger_transactions", indexes = {
        @Index(name = "idx_ledger_user_time", columnList = "userId,createdAt")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerTransaction {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID txId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String type; // XP_EARNED, COIN_EARNED, REWARD_REDEEMED

    @Column(nullable = false)
    private long amount;

    @Column(nullable = false)
    private String currency; // XP, COIN

    @Column(columnDefinition = "TEXT")
    private String meta;

    @Column(nullable = false)
    private Instant createdAt;
}
