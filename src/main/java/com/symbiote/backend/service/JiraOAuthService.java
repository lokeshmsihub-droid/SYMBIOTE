package com.symbiote.backend.service;

import com.symbiote.backend.entity.JiraUserConnection;
import com.symbiote.backend.entity.JiraOAuthToken;
import com.symbiote.backend.repository.JiraOAuthTokenRepository;
import com.symbiote.backend.repository.JiraUserConnectionRepository;
import com.symbiote.backend.security.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JiraOAuthService {

    private static final Logger log = LoggerFactory.getLogger(JiraOAuthService.class);
    
    @Value("${JIRA_CLIENT_ID:}")
    private String clientId;
    
    @Value("${JIRA_CLIENT_SECRET:}")
    private String clientSecret;
    
    @Value("${JIRA_REDIRECT_URI:http://localhost:8080/api/jira/oauth/callback}")
    private String redirectUri;

    private final JiraUserConnectionRepository connectionRepository;
    private final JiraOAuthTokenRepository tokenRepository;
    private final EncryptionUtil encryptionUtil;
    
    private final RestTemplate restTemplate = new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();

    /**
     * Legacy workspace-level Jira OAuth token used by admin Jira features.
     * This is separate from per-user Jira connections stored in JiraUserConnection.
     */
    @Transactional
    public synchronized String getValidAccessToken() {
        JiraOAuthToken token = tokenRepository.findByEnvironment("DEFAULT_WORKSPACE")
                .orElseThrow(() -> new IllegalStateException("No Jira workspace connection found. Admin must connect Jira first."));

        Instant expiresAt = token.getExpiryTime();
        if (expiresAt == null || expiresAt.isBefore(Instant.now().plus(Duration.ofMinutes(5)))) {
            return refreshWorkspaceToken(token).getAccessToken();
        }
        return token.getAccessToken();
    }

    @Transactional
    public JiraOAuthToken refreshWorkspaceToken(JiraOAuthToken token) {
        String tokenUrl = "https://auth.atlassian.com/oauth/token";

        Map<String, String> body = Map.of(
                "grant_type", "refresh_token",
                "client_id", clientId,
                "client_secret", clientSecret,
                "refresh_token", token.getRefreshToken()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, new HttpEntity<>(body, headers), Map.class);
            Map<?, ?> responseBody = response.getBody();

            if (responseBody == null || !responseBody.containsKey("access_token")) {
                throw new IllegalStateException("Invalid token refresh response from Atlassian");
            }

            String accessToken = (String) responseBody.get("access_token");
            String refreshToken = (String) responseBody.get("refresh_token");
            Integer expiresIn = (Integer) responseBody.get("expires_in");

            token.setAccessToken(accessToken);
            if (refreshToken != null && !refreshToken.isBlank()) {
                token.setRefreshToken(refreshToken);
            }
            token.setExpiryTime(Instant.now().plusSeconds(expiresIn != null ? expiresIn : 3600));

            return tokenRepository.save(token);
        } catch (HttpStatusCodeException e) {
            log.error("Jira workspace token refresh failed: {} {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to refresh Jira workspace token", e);
        }
    }

    @Transactional
    public void exchangeCodeForUserToken(Long userId, String code) {
        String tokenUrl = "https://auth.atlassian.com/oauth/token";

        Map<String, String> body = Map.of(
                "grant_type", "authorization_code",
                "client_id", clientId,
                "client_secret", clientSecret,
                "code", code,
                "redirect_uri", redirectUri
        );

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, body, Map.class);
            Map<?, ?> responseBody = response.getBody();
            
            if (responseBody == null || !responseBody.containsKey("access_token")) {
                throw new IllegalStateException("Invalid token response from Atlassian");
            }

            String accessToken = (String) responseBody.get("access_token");
            String refreshToken = (String) responseBody.get("refresh_token");
            Integer expiresIn = (Integer) responseBody.get("expires_in");

            // 1. Fetch Cloud ID
            Map<String, String> site = fetchAccessibleSite(accessToken);
            String cloudId = site.get("id");

            // 2. Fetch Jira Account Info (myself)
            Map<String, String> profile = fetchJiraProfile(accessToken, cloudId);
            String jiraAccountId = profile.get("accountId");
            String displayName = profile.get("displayName");

            // 3. Upsert Connection
            JiraUserConnection connection = connectionRepository.findByUserId(userId)
                    .orElse(new JiraUserConnection());
            
            connection.setUserId(userId);
            connection.setJiraAccountId(jiraAccountId);
            connection.setDisplayName(displayName);
            connection.setAccessToken(encryptionUtil.encrypt(accessToken));
            connection.setRefreshToken(encryptionUtil.encrypt(refreshToken));
            connection.setExpiryTime(LocalDateTime.now().plusSeconds(expiresIn != null ? expiresIn : 3600));
            connection.setCloudId(cloudId);

            connectionRepository.save(connection);
            log.info("Successfully connected Jira account {} for SYMBIOTE user {}", jiraAccountId, userId);

        } catch (Exception e) {
            log.error("OAuth exchange failed for user {}: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to connect Jira account", e);
        }
    }

    @Transactional
    public void disconnect(Long userId) {
        connectionRepository.findByUserId(userId).ifPresent(connection -> {
            connectionRepository.delete(connection);
            log.info("Disconnected Jira account for user {}", userId);
        });
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getConnectionStatus(Long userId) {
        return connectionRepository.findByUserId(userId)
                .map(conn -> Map.<String, Object>of(
                        "connected", true,
                        "displayName", conn.getDisplayName(),
                        "jiraAccountId", conn.getJiraAccountId()
                ))
                .orElse(Map.of("connected", false));
    }

    private Map<String, String> fetchAccessibleSite(String accessToken) {
        String url = "https://api.atlassian.com/oauth/token/accessible-resources";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), List.class);
        if (response.getBody() == null || response.getBody().isEmpty()) {
            throw new IllegalStateException("No accessible Jira sites found");
        }
        
        Map<?, ?> site = (Map<?, ?>) response.getBody().get(0); // Connect to the first available site
        return Map.of(
                "id", (String) site.get("id"),
                "url", (String) site.get("url")
        );
    }

    private Map<String, String> fetchJiraProfile(String accessToken, String cloudId) {
        String url = "https://api.atlassian.com/ex/jira/" + cloudId + "/rest/api/3/myself";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
        Map<?, ?> body = response.getBody();
        if (body == null) throw new IllegalStateException("Failed to fetch Jira profile");
        
        return Map.of(
                "accountId", (String) body.get("accountId"),
                "displayName", (String) body.get("displayName")
        );
    }
}
