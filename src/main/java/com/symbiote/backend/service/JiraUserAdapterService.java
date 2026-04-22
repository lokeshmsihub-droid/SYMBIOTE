package com.symbiote.backend.service;

import com.symbiote.backend.entity.JiraUserConnection;
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
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JiraUserAdapterService {

    private static final Logger log = LoggerFactory.getLogger(JiraUserAdapterService.class);

    @Value("${JIRA_CLIENT_ID:}")
    private String clientId;

    @Value("${JIRA_CLIENT_SECRET:}")
    private String clientSecret;

    private final JiraUserConnectionRepository connectionRepository;
    private final EncryptionUtil encryptionUtil;
    
    private final RestTemplate restTemplate = new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();

    public List<Map<String, Object>> getMyTasks(Long userId) {
        JiraUserConnection connection = refreshIfNeeded(userId);
        
        String jql = "assignee = currentUser() ORDER BY updated DESC";
        String url = "https://api.atlassian.com/ex/jira/" + connection.getCloudId() + 
                     "/rest/api/3/search?jql=" + java.net.URLEncoder.encode(jql, java.nio.charset.StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(encryptionUtil.decrypt(connection.getAccessToken()));
        
        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
            return (List<Map<String, Object>>) response.getBody().get("issues");
        } catch (Exception e) {
            log.error("Failed to fetch Jira tasks for user {}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    @Transactional
    public synchronized JiraUserConnection refreshIfNeeded(Long userId) {
        JiraUserConnection connection = connectionRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Jira account not connected for user: " + userId));

        // Refresh if expiring in less than 5 minutes
        if (connection.getExpiryTime().isBefore(LocalDateTime.now().plusMinutes(5))) {
            log.info("Refreshing Jira token for user {}", userId);
            
            String tokenUrl = "https://auth.atlassian.com/oauth/token";
            Map<String, String> body = Map.of(
                    "grant_type", "refresh_token",
                    "client_id", clientId,
                    "client_secret", clientSecret,
                    "refresh_token", encryptionUtil.decrypt(connection.getRefreshToken())
            );

            try {
                ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, body, Map.class);
                Map<?, ?> responseBody = response.getBody();
                
                String accessToken = (String) responseBody.get("access_token");
                String refreshToken = (String) responseBody.get("refresh_token");
                Integer expiresIn = (Integer) responseBody.get("expires_in");

                connection.setAccessToken(encryptionUtil.encrypt(accessToken));
                if (refreshToken != null) {
                    connection.setRefreshToken(encryptionUtil.encrypt(refreshToken));
                }
                connection.setExpiryTime(LocalDateTime.now().plusSeconds(expiresIn != null ? expiresIn : 3600));
                
                return connectionRepository.save(connection);
            } catch (Exception e) {
                log.error("Failed to refresh Jira token for user {}: {}", userId, e.getMessage());
                throw new RuntimeException("Jira session expired. Please reconnect.");
            }
        }
        
        return connection;
    }
}
