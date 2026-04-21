package com.symbiote.backend.controller;

import com.symbiote.backend.config.JiraConfig;
import com.symbiote.backend.dto.JiraWebhookResponse;
import com.symbiote.backend.service.JiraWebhookService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jira")
@RequiredArgsConstructor
public class JiraWebhookController {
    private final JiraWebhookService webhookService;
    private final JiraConfig jiraConfig;

    @PostMapping("/webhook")
    public ResponseEntity<JiraWebhookResponse> handle(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        String secret = jiraConfig.getWebhookSecret();
        if (secret != null && !secret.isBlank()) {
            String provided = request.getHeader("X-SYMBIOTE-SECRET");
            if (provided == null || provided.isBlank()) {
                provided = request.getParameter("token");
            }
            if (!secret.equals(provided)) {
                return ResponseEntity.status(401).body(new JiraWebhookResponse("UNAUTHORIZED"));
            }
        }
        webhookService.handleWebhook(payload);
        return ResponseEntity.ok(new JiraWebhookResponse("OK"));
    }
}
