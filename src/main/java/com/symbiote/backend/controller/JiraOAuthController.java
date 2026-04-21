package com.symbiote.backend.controller;

import com.symbiote.backend.entity.JiraOAuthToken;
import com.symbiote.backend.service.JiraOAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/jira/oauth")
@RequiredArgsConstructor
public class JiraOAuthController {

    private final JiraOAuthService oAuthService;

    @Value("${JIRA_CLIENT_ID:}")
    private String clientId;

    @Value("${JIRA_REDIRECT_URI:http://localhost:8080/api/jira/oauth/callback}")
    private String redirectUri;

    @GetMapping("/start")
    public ResponseEntity<Void> initiateOAuth() {
        // Generating a unique state to prevent CSRF. In full prod, store this state inside 
        // a user session or cache (Redis) and validate it upon callback.
        String state = UUID.randomUUID().toString();
        
        String authUrl = "https://auth.atlassian.com/authorize?" +
                "audience=api.atlassian.com" +
                "&client_id=" + clientId +
                "&scope=read:jira-work%20write:jira-work%20offline_access" +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&state=" + state +
                "&prompt=consent";
        return ResponseEntity.status(302).header("Location", authUrl).build();
    }

    @GetMapping("/callback")
    public ResponseEntity<?> handleOAuthCallback(
            @RequestParam(name = "code", required = false) String code,
            @RequestParam(name = "state", required = false) String state,
            @RequestParam(name = "error", required = false) String error,
            @RequestParam(name = "error_description", required = false) String errorDescription) {

        if (error != null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "code", "OAUTH_DENIED",
                    "message", errorDescription != null ? errorDescription : error
            ));
        }

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "code", "MISSING_ARGUMENT",
                    "message", "Missing authorization code"
            ));
        }

        try {
            oAuthService.exchangeCodeForToken(code);
            return ResponseEntity.status(302)
                    .header("Location", "http://localhost:5173/admin/jira?oauth=success")
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(302)
                    .header("Location", "http://localhost:5173/admin/jira?oauth=error&message=" + e.getMessage())
                    .build();
        }
    }
}
