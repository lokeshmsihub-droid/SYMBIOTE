package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_state")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private long xp;

    @Column(nullable = false)
    private long coins;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
    private int currentStreak;

    @Column(nullable = false)
    private int longestStreak;

    @Column
    private java.time.LocalDate lastActiveDate;

    @Column(nullable = false)
    private java.time.Instant updatedAt;

    @Version
    private Long version;
}
