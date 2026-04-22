package com.symbiote.backend.controller;

import com.symbiote.backend.service.AdminJiraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/jira")
@RequiredArgsConstructor
public class AdminJiraController {

    private final AdminJiraService adminJiraService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(adminJiraService.getConnectionStatus());
    }

    @GetMapping("/projects")
    public ResponseEntity<Object> getProjects() {
        return ResponseEntity.ok(adminJiraService.getProjects());
    }

    @GetMapping("/users/{projectKey}")
    public ResponseEntity<Object> getUsers(@PathVariable String projectKey) {
        return ResponseEntity.ok(adminJiraService.getUsers(projectKey));
    }

    @PostMapping("/tasks/{projectKey}")
    public ResponseEntity<Object> createTask(@PathVariable String projectKey, @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(adminJiraService.createTask(projectKey, payload));
    }
}
