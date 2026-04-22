package com.symbiote.backend.controller;

import com.symbiote.backend.service.JiraOAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/jira/oauth")
@RequiredArgsConstructor
public class JiraOAuthController {

    private final JiraOAuthService jiraOAuthService;

    @Value("${JIRA_CLIENT_ID:}")
    private String clientId;

    @Value("${JIRA_REDIRECT_URI:http://localhost:8080/api/jira/oauth/callback}")
    private String redirectUri;

    @GetMapping("/start")
    public RedirectView startOAuth() {
        String scopes = "read:jira-work read:jira-user manage:jira-configuration write:jira-work offline_access";
        String authUrl = String.format(
                "https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=%s&scope=%s&redirect_uri=%s&state=SYMBIOTE&response_type=code&prompt=consent",
                clientId,
                URLEncoder.encode(scopes, StandardCharsets.UTF_8),
                URLEncoder.encode(redirectUri, StandardCharsets.UTF_8)
        );
        return new RedirectView(authUrl);
    }

    @GetMapping("/callback")
    public RedirectView callback(@RequestParam String code, @RequestParam(required = false) String state) {
        jiraOAuthService.exchangeCodeForToken(code);
        // Redirect back to the frontend admin page
        return new RedirectView("http://localhost:5173/admin/jira");
    }
}
