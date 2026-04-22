package com.symbiote.backend.controller;

import com.symbiote.backend.entity.JiraUserMapping;
import com.symbiote.backend.entity.UnmappedWebhookEvent;
import com.symbiote.backend.entity.User;
import com.symbiote.backend.repository.UnmappedWebhookEventRepository;
import com.symbiote.backend.repository.UserRepository;
import com.symbiote.backend.service.JiraUserMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/mappings")
@RequiredArgsConstructor
public class AdminUserMappingController {

    private final JiraUserMappingService mappingService;
    private final UnmappedWebhookEventRepository unmappedRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getMappings() {
        List<User> users = userRepository.findAll();
        List<JiraUserMapping> mappings = mappingService.getAllMappings();
        
        List<Map<String, Object>> result = users.stream().map(user -> {
            JiraUserMapping mapping = mappings.stream()
                    .filter(m -> m.getSymbioteUserId().equals(user.getId()))
                    .findFirst().orElse(null);
            
            Map<String, Object> row = new HashMap<>();
            row.put("userId", user.getId());
            row.put("name", user.getName());
            row.put("email", user.getEmail());
            row.put("jiraAccountId", mapping != null ? mapping.getJiraAccountId() : "");
            row.put("source", mapping != null ? mapping.getSource() : "NONE");
            row.put("displayName", mapping != null ? (mapping.getDisplayName() != null ? mapping.getDisplayName() : "") : "");
            return row;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<JiraUserMapping> createMapping(@RequestBody Map<String, String> request) {
        Long userId = Long.parseLong(request.get("userId"));
        String jiraAccountId = request.get("jiraAccountId");
        String displayName = request.get("displayName");
        
        // Remove existing mapping if any
        mappingService.deleteMapping(userId);
        
        return ResponseEntity.ok(mappingService.create(userId, jiraAccountId, "MANUAL", displayName));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteMapping(@PathVariable Long userId) {
        mappingService.deleteMapping(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unmapped")
    public ResponseEntity<List<UnmappedWebhookEvent>> getUnmapped() {
        return ResponseEntity.ok(unmappedRepository.findAll());
    }
}
