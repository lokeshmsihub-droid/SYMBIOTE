package com.symbiote.backend.controller;

import com.symbiote.backend.entity.User;
import com.symbiote.backend.repository.UserRepository;
import com.symbiote.backend.service.JiraUserAdapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final JiraUserAdapterService jiraUserAdapterService;
    private final UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyTasks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<Map<String, Object>> tasks = jiraUserAdapterService.getMyTasks(user.getId());
            return ResponseEntity.ok(tasks);
        } catch (IllegalStateException e) {
            // Not connected to Jira
            return ResponseEntity.ok(Collections.emptyList());
        }
    }
}
