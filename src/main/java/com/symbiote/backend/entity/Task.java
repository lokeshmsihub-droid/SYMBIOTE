package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tasks", indexes = {
        @Index(name = "idx_tasks_user", columnList = "userId"),
        @Index(name = "idx_tasks_jira", columnList = "jiraIssueKey", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID taskId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String jiraIssueKey;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long sprintId;

    @Column(nullable = false)
    private String priority;

    @Column
    private Integer storyPoints;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;
}
