package com.symbiote.backend.service;

import com.symbiote.backend.dto.AdminTaskRequest;
import com.symbiote.backend.entity.JiraUserMapping;
import com.symbiote.backend.entity.Task;
import com.symbiote.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminTaskService {
    private static final Logger log = LoggerFactory.getLogger(AdminTaskService.class);

    private final JiraAdapterService jiraAdapterService;
    private final JiraUserMappingService mappingService;
    private final TaskRepository taskRepository;

    @Transactional
    public Task createTask(AdminTaskRequest request) {
        JiraUserMapping mapping = mappingService.getOrThrowBySymbioteUser(request.getAssigneeUserId());
        // Assume default project key for now, or fetch from config if available.
        String projectKey = "KAN"; 
        String issueKey = jiraAdapterService.createIssue(projectKey, request.getTitle(), request.getDescription(), mapping.getJiraAccountId(), request.getPriority());

        String status = "CREATED";

        Task task = Task.builder()
                .taskId(UUID.randomUUID())
                .title(request.getTitle())
                .description(request.getDescription())
                .jiraIssueKey(issueKey)
                .status(status)
                .userId(request.getAssigneeUserId())
                .sprintId(request.getSprintId())
                .priority(request.getPriority())
                .storyPoints(request.getStoryPoints())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return taskRepository.save(task);
    }

    public List<Task> listTasks() {
        return taskRepository.findAll();
    }
}
