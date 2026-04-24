package com.symbiote.backend.controller;

import com.symbiote.backend.config.JiraConfig;
import com.symbiote.backend.config.SymbioteAppConfig;
import com.symbiote.backend.entity.User;
import com.symbiote.backend.repository.UserRepository;
import com.symbiote.backend.security.JwtUtil;
import com.symbiote.backend.service.JiraOAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/jira/oauth")
@RequiredArgsConstructor
public class JiraOAuthController {

    private final JiraOAuthService jiraOAuthService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final JiraConfig jiraConfig;
    private final SymbioteAppConfig appConfig;

    @GetMapping("/authorize-url")
    public ResponseEntity<Map<String, String>> getAuthorizeUrl() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String state = jwtUtil.generateStateToken(user.getId());
        String url = buildAuthUrl(state);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/start")
    public RedirectView startOAuth() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String state = jwtUtil.generateStateToken(user.getId());
        return new RedirectView(buildAuthUrl(state));
    }

    private String buildAuthUrl(String state) {
        String scopes = "read:jira-work read:jira-user offline_access";
        return String.format(
                "%s/authorize?audience=api.atlassian.com&client_id=%s&scope=%s&redirect_uri=%s&state=%s&response_type=code&prompt=consent",
                jiraConfig.getAuthUrl(),
                jiraConfig.getClientId(),
                URLEncoder.encode(scopes, StandardCharsets.UTF_8),
                URLEncoder.encode(jiraConfig.getRedirectUri(), StandardCharsets.UTF_8),
                state
        );
    }

    @GetMapping("/callback")
    public RedirectView callback(@RequestParam String code, @RequestParam String state) {
        // Verify signed state and extract userId
        Long userId = jwtUtil.getUserIdFromStateToken(state);

        jiraOAuthService.exchangeCodeForUserToken(userId, code);
        
        // Redirect back to frontend dashboard
        return new RedirectView(appConfig.getFrontendUrl() + "/dashboard");
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(jiraOAuthService.getConnectionStatus(user.getId()));
    }

    @DeleteMapping("/disconnect")
    public ResponseEntity<Void> disconnect() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        jiraOAuthService.disconnect(user.getId());
        return ResponseEntity.noContent().build();
    }
}
