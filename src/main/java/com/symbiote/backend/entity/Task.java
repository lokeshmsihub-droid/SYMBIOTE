package com.symbiote.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tasks", indexes = {
        @Index(name = "idx_tasks_user", columnList = "userId"),
        @Index(name = "idx_tasks_jira", columnList = "jiraIssueKey", unique = true)
})
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

    public Task() {}

    public Task(UUID taskId, String title, String description, String jiraIssueKey, String status, Long userId, Long sprintId, String priority, Integer storyPoints, Instant createdAt, Instant updatedAt) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.jiraIssueKey = jiraIssueKey;
        this.status = status;
        this.userId = userId;
        this.sprintId = sprintId;
        this.priority = priority;
        this.storyPoints = storyPoints;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static TaskBuilder builder() {
        return new TaskBuilder();
    }

    public static class TaskBuilder {
        private UUID taskId;
        private String title;
        private String description;
        private String jiraIssueKey;
        private String status;
        private Long userId;
        private Long sprintId;
        private String priority;
        private Integer storyPoints;
        private Instant createdAt;
        private Instant updatedAt;

        public TaskBuilder taskId(UUID taskId) { this.taskId = taskId; return this; }
        public TaskBuilder title(String title) { this.title = title; return this; }
        public TaskBuilder description(String description) { this.description = description; return this; }
        public TaskBuilder jiraIssueKey(String jiraIssueKey) { this.jiraIssueKey = jiraIssueKey; return this; }
        public TaskBuilder status(String status) { this.status = status; return this; }
        public TaskBuilder userId(Long userId) { this.userId = userId; return this; }
        public TaskBuilder sprintId(Long sprintId) { this.sprintId = sprintId; return this; }
        public TaskBuilder priority(String priority) { this.priority = priority; return this; }
        public TaskBuilder storyPoints(Integer storyPoints) { this.storyPoints = storyPoints; return this; }
        public TaskBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public TaskBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Task build() {
            return new Task(taskId, title, description, jiraIssueKey, status, userId, sprintId, priority, storyPoints, createdAt, updatedAt);
        }
    }

    // Getters and Setters
    public UUID getTaskId() { return taskId; }
    public void setTaskId(UUID taskId) { this.taskId = taskId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getJiraIssueKey() { return jiraIssueKey; }
    public void setJiraIssueKey(String jiraIssueKey) { this.jiraIssueKey = jiraIssueKey; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getSprintId() { return sprintId; }
    public void setSprintId(Long sprintId) { this.sprintId = sprintId; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Integer getStoryPoints() { return storyPoints; }
    public void setStoryPoints(Integer storyPoints) { this.storyPoints = storyPoints; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
