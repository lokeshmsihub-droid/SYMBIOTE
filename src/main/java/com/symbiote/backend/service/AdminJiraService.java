package com.symbiote.backend.service;

import com.symbiote.backend.entity.JiraOAuthToken;
import com.symbiote.backend.repository.JiraOAuthTokenRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminJiraService {

    private static final Logger log = LoggerFactory.getLogger(AdminJiraService.class);

    private final JiraAdapterService jiraAdapterService;
    private final JiraOAuthTokenRepository tokenRepository;

    public Object getProjects() {
        return jiraAdapterService.getProjects(0, 50);
    }

    public Object getUsers(String projectKey) {
        return jiraAdapterService.getUsers(projectKey, 0, 50);
    }

    public Object createTask(String projectKey, Map<String, Object> taskDetails) {
        // This is a generic task creation, we might need a more specific one in JiraAdapterService
        // but for now let's use the one we have or add a generic one.
        String title = (String) ((Map<String, Object>) taskDetails.get("fields")).get("summary");
        String description = ""; // Extract description if available
        String priority = "Medium";
        return jiraAdapterService.createIssue(projectKey, title, description, null, priority);
    }

    public Map<String, Object> getConnectionStatus() {
        return tokenRepository.findByEnvironment("DEFAULT_WORKSPACE")
            .map(t -> Map.of(
                "connected", (Object)true, 
                "siteUrl", t.getSiteUrl(), 
                "cloudId", t.getCloudId(),
                "expiresAt", t.getExpiryTime().toString()
            ))
            .orElse(Map.of("connected", false));
    }
}
