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

    private final JiraOAuthTokenRepository tokenRepository;
    
    private final RestTemplate restTemplate = new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();

    private JiraOAuthToken getValidToken() {
        return tokenRepository.findByEnvironment("DEFAULT_WORKSPACE")
                .orElseThrow(() -> new RuntimeException("Jira is not connected. Authenticate first."));
    }

    private String getBaseApiUrl(JiraOAuthToken token) {
        return "https://api.atlassian.com/ex/jira/" + token.getCloudId() + "/rest/api/3";
    }

    private HttpHeaders getAuthHeaders(JiraOAuthToken token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token.getAccessToken());
        headers.set("Accept", "application/json");
        return headers;
    }

    public Object getProjects() {
        JiraOAuthToken token = getValidToken();
        String url = getBaseApiUrl(token) + "/project";
        try {
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(getAuthHeaders(token)), Object.class);
            return response.getBody();
        } catch (HttpStatusCodeException e) {
            log.error("Failed to fetch Jira projects: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Atlassian API Error: " + e.getResponseBodyAsString());
        }
    }

    public Object getUsers() {
        JiraOAuthToken token = getValidToken();
        // search endpoint without query returns list of assignable users natively in modern Jira 3LO
        String url = getBaseApiUrl(token) + "/users/search";
        try {
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(getAuthHeaders(token)), Object.class);
            return response.getBody();
        } catch (HttpStatusCodeException e) {
            log.error("Failed to fetch Jira users: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Atlassian API Error: " + e.getResponseBodyAsString());
        }
    }

    public Object createTask(Map<String, Object> taskDetails) {
        JiraOAuthToken token = getValidToken();
        String url = getBaseApiUrl(token) + "/issue";
        HttpHeaders headers = getAuthHeaders(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        try {
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(taskDetails, headers), Object.class);
            return response.getBody();
        } catch (HttpStatusCodeException e) {
            log.error("Failed to create Jira task: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Atlassian API Error: " + e.getResponseBodyAsString());
        }
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
