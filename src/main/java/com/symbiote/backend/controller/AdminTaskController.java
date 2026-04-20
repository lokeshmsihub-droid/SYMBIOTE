package com.symbiote.backend.controller;

import com.symbiote.backend.dto.AdminTaskRequest;
import com.symbiote.backend.dto.AdminTaskResponse;
import com.symbiote.backend.entity.Task;
import com.symbiote.backend.service.AdminTaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tasks")
@RequiredArgsConstructor
public class AdminTaskController {
    private final AdminTaskService adminTaskService;

    @PostMapping
    public ResponseEntity<AdminTaskResponse> create(@Valid @RequestBody AdminTaskRequest request) {
        Task task = adminTaskService.createTask(request);
        String message = task.getStatus().equals("JIRA_PARTIAL")
                ? "Created Jira issue but assignment/sprint failed. Review in Jira."
                : "Task created successfully";
        return ResponseEntity.ok(new AdminTaskResponse(task.getTaskId(), task.getJiraIssueKey(), task.getStatus(), message));
    }

    @GetMapping
    public ResponseEntity<List<Task>> list() {
        return ResponseEntity.ok(adminTaskService.listTasks());
    }
}
