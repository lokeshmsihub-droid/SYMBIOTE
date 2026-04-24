package com.symbiote.backend.service;

import com.symbiote.backend.config.JiraConfig;
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
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JiraAdapterService {
    private static final Logger log = LoggerFactory.getLogger(JiraAdapterService.class);

    private final JiraOAuthService jiraOAuthService;
    private final JiraOAuthTokenRepository tokenRepository;
    private final JiraConfig jiraConfig;
    private final RestTemplate restTemplate = new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();

    public List<Map<String, Object>> getProjects(int startAt, int maxResults) {
        String url = getBaseUrl() + "/rest/api/3/project?startAt=" + startAt + "&maxResults=" + maxResults;
        ResponseEntity<List> response = exchange(url, HttpMethod.GET, null, List.class);
        return response.getBody() != null ? response.getBody() : Collections.emptyList();
    }

    public List<Map<String, Object>> getUsers(String projectKey, int startAt, int maxResults) {
        String url = getBaseUrl() + "/rest/api/3/user/assignable/search?project=" + projectKey + "&startAt=" + startAt + "&maxResults=" + maxResults;
        ResponseEntity<List> response = exchange(url, HttpMethod.GET, null, List.class);
        return response.getBody() != null ? response.getBody() : Collections.emptyList();
    }

    public String createIssue(String projectKey, String title, String description, String assigneeId, String priority) {
        String url = getBaseUrl() + "/rest/api/3/issue";

        Map<String, Object> fields = Map.of(
                "project", Map.of("key", projectKey),
                "summary", title,
                "description", Map.of("type", "doc", "version", 1,
                        "content", List.of(Map.of(
                                "type", "paragraph",
                                "content", List.of(Map.of("type", "text", "text", description == null ? "" : description))
                        ))),
                "issuetype", Map.of("name", "Task"),
                "priority", Map.of("name", priority)
        );

        Map<String, Object> payload = new java.util.HashMap<>(Map.of("fields", fields));
        if (assigneeId != null) {
            ((Map<String, Object>) payload.get("fields")).put("assignee", Map.of("id", assigneeId));
        }

        ResponseEntity<Map> response = exchange(url, HttpMethod.POST, payload, Map.class);
        return String.valueOf(response.getBody().get("key"));
    }

    public List<Map<String, Object>> getIssuesByAssignee(String accountId, String projectKey) {
        String jql = String.format("assignee = '%s' AND project = '%s' ORDER BY updated DESC", accountId, projectKey);
        String url = getBaseUrl() + "/rest/api/3/search?jql=" + java.net.URLEncoder.encode(jql, java.nio.charset.StandardCharsets.UTF_8);
        
        ResponseEntity<Map> response = exchange(url, HttpMethod.GET, null, Map.class);
        return (List<Map<String, Object>>) response.getBody().get("issues");
    }

    private String getBaseUrl() {
        JiraOAuthToken token = tokenRepository.findByEnvironment("DEFAULT_WORKSPACE")
                .orElseThrow(() -> new IllegalStateException("Jira not connected"));
        return jiraConfig.getApiBaseUrl() + "/ex/jira/" + token.getCloudId();
    }

    private <T> ResponseEntity<T> exchange(String url, HttpMethod method, Object payload, Class<T> responseType) {
        int maxRetries = 3;
        int attempt = 0;
        
        while (attempt < maxRetries) {
            String accessToken = jiraOAuthService.getValidAccessToken();
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<?> entity = payload != null ? new HttpEntity<>(payload, headers) : new HttpEntity<>(headers);
            
            try {
                return restTemplate.exchange(url, method, entity, responseType);
            } catch (HttpStatusCodeException ex) {
                if (ex.getStatusCode().value() == 429) {
                    attempt++;
                    long waitTime = (long) Math.pow(2, attempt) * 1000;
                    log.warn("Jira API Rate Limited (429). Retrying in {}ms (Attempt {}/{})", waitTime, attempt, maxRetries);
                    try { Thread.sleep(waitTime); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
                    continue;
                }
                log.error("Jira API error: {} {}", ex.getStatusCode(), ex.getResponseBodyAsString());
                throw new IllegalStateException("Jira API error: " + ex.getStatusCode());
            }
        }
        throw new IllegalStateException("Jira API failed after " + maxRetries + " retries due to rate limiting");
    }
}
