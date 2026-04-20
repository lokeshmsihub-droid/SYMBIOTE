package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_achievements", uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_achievement", columnNames = {"userId", "achievementId"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAchievement {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private UUID achievementId;

    @Column(nullable = false)
    private Instant unlockedAt;
}
