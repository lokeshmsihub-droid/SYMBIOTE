package com.symbiote.backend.controller;

import com.symbiote.backend.config.JiraConfig;
import com.symbiote.backend.dto.JiraWebhookResponse;
import com.symbiote.backend.service.JiraWebhookService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("/api/jira")
@RequiredArgsConstructor
@Slf4j
public class JiraWebhookController {
    private final JiraWebhookService webhookService;
    private final JiraConfig jiraConfig;

    @PostMapping("/webhook")
    public ResponseEntity<JiraWebhookResponse> handle(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        String secret = jiraConfig.getWebhookSecret();

        // CRIT-5: Webhook secret is mandatory in production.
        // Fail-closed: if no secret is configured, reject all webhooks.
        if (secret == null || secret.isBlank()) {
            log.error("JIRA_WEBHOOK_SECRET is not configured. Rejecting webhook for security.");
            return ResponseEntity.status(503).body(new JiraWebhookResponse("WEBHOOK_SECRET_NOT_CONFIGURED"));
        }

        // Only accept secret via header — never query params (logged in access logs)
        String provided = request.getHeader("X-SYMBIOTE-SECRET");

        // Constant-time comparison to prevent timing attacks
        if (provided == null || !MessageDigest.isEqual(
                secret.getBytes(java.nio.charset.StandardCharsets.UTF_8),
                provided.getBytes(java.nio.charset.StandardCharsets.UTF_8))) {
            log.warn("Webhook authentication failed from IP: {}", request.getRemoteAddr());
            return ResponseEntity.status(401).body(new JiraWebhookResponse("UNAUTHORIZED"));
        }

        webhookService.handleWebhook(payload);
        return ResponseEntity.ok(new JiraWebhookResponse("OK"));
    }
}
