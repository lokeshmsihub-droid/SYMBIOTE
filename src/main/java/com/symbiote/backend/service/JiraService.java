package com.symbiote.backend.service;

import com.symbiote.backend.config.JiraConfig;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JiraService {
    private static final Logger log = LoggerFactory.getLogger(JiraService.class);

    private final JiraConfig jiraConfig;
    private final RestTemplate restTemplate = new RestTemplateBuilder().build();

    public String createIssue(String title, String description, String priority, Integer storyPoints) {
        String url = jiraConfig.getBaseUrl() + "/rest/api/3/issue";

        Map<String, Object> fields = Map.of(
                "project", Map.of("key", jiraConfig.getProjectKey()),
                "summary", title,
                "description", Map.of("type", "doc", "version", 1,
                        "content", List.of(Map.of(
                                "type", "paragraph",
                                "content", List.of(Map.of("type", "text", "text", description == null ? "" : description))
                        ))),
                "issuetype", Map.of("name", "Task"),
                "priority", Map.of("name", priority)
        );

        Map<String, Object> payload = Map.of("fields", fields);
        if (storyPoints != null) {
            payload = Map.of("fields", Map.of(
                    "project", Map.of("key", jiraConfig.getProjectKey()),
                    "summary", title,
                    "description", Map.of("type", "doc", "version", 1,
                            "content", List.of(Map.of(
                                    "type", "paragraph",
                                    "content", List.of(Map.of("type", "text", "text", description == null ? "" : description))
                            ))),
                    "issuetype", Map.of("name", "Task"),
                    "priority", Map.of("name", priority),
                    jiraConfig.getStoryPointsField(), storyPoints
            ));
        }

        ResponseEntity<Map> response = exchange(url, HttpMethod.POST, payload);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new IllegalStateException("Failed to create Jira issue");
        }
        Object key = response.getBody().get("key");
        return String.valueOf(key);
    }

    public void assignUser(String issueKey, String jiraAccountId) {
        String url = jiraConfig.getBaseUrl() + "/rest/api/3/issue/" + issueKey + "/assignee";
        Map<String, Object> payload = Map.of("accountId", jiraAccountId);
        exchange(url, HttpMethod.PUT, payload);
    }

    public void addToSprint(String issueKey, Long sprintId) {
        String url = jiraConfig.getBaseUrl() + "/rest/agile/1.0/sprint/" + sprintId + "/issue";
        Map<String, Object> payload = Map.of("issues", List.of(issueKey));
        exchange(url, HttpMethod.POST, payload);
    }

    public Map getIssueDetails(String issueKey) {
        String url = jiraConfig.getBaseUrl() + "/rest/api/3/issue/" + issueKey;
        ResponseEntity<Map> response = exchange(url, HttpMethod.GET, null);
        return response.getBody();
    }

    private ResponseEntity<Map> exchange(String url, HttpMethod method, Object payload) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", basicAuth());

        HttpEntity<?> entity = payload != null ? new HttpEntity<>(payload, headers) : new HttpEntity<>(headers);
        try {
            return restTemplate.exchange(url, method, entity, Map.class);
        } catch (HttpStatusCodeException ex) {
            log.error("Jira API error: {} {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new IllegalStateException("Jira API error: " + ex.getStatusCode());
        }
    }

    private String basicAuth() {
        String value = jiraConfig.getEmail() + ":" + jiraConfig.getApiToken();
        return "Basic " + Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }
}
