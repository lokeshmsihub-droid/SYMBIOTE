package com.symbiote.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "symbiote.jira")
public class JiraConfig {
    private String baseUrl;
    private String email;
    private String apiToken;
    private String projectKey;
    private String webhookSecret;
    private String storyPointsField = "customfield_10016";
    private String authUrl;
    private String apiBaseUrl;
    private String redirectUri;
    private String webhookBaseUrl;
    private String clientId;
    private String clientSecret;
}
