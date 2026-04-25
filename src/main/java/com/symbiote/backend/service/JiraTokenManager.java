package com.symbiote.backend.service;

import com.symbiote.backend.config.JiraConfig;
import com.symbiote.backend.entity.JiraUserConnection;
import com.symbiote.backend.entity.JiraOAuthToken;
import com.symbiote.backend.repository.JiraOAuthTokenRepository;
import com.symbiote.backend.repository.JiraUserConnectionRepository;
import com.symbiote.backend.security.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

@Service
@RequiredArgsConstructor
@Slf4j
public class JiraTokenManager {

    private final JiraUserConnectionRepository connectionRepository;
    private final JiraOAuthTokenRepository tokenRepository;
    private final EncryptionUtil encryptionUtil;
    private final RestTemplate restTemplate = new RestTemplate();
    private final JiraConfig jiraConfig;

    private final Map<String, ReentrantLock> locks = new ConcurrentHashMap<>();

    public String getValidUserToken(Long userId) {
        ReentrantLock lock = locks.computeIfAbsent("USER_" + userId, k -> new ReentrantLock());
        lock.lock();
        try {
            JiraUserConnection connection = connectionRepository.findByUserId(userId)
                    .orElseThrow(() -> new IllegalStateException("No Jira connection for user: " + userId));

            if (isExpired(connection.getExpiryTime())) {
                refreshUserToken(connection);
            }
            return encryptionUtil.decrypt(connection.getAccessToken());
        } finally {
            lock.unlock();
        }
    }

    public String getValidAdminToken() {
        ReentrantLock lock = locks.computeIfAbsent("ADMIN", k -> new ReentrantLock());
        lock.lock();
        try {
            JiraOAuthToken token = tokenRepository.findByEnvironment("DEFAULT_WORKSPACE")
                    .orElseThrow(() -> new IllegalStateException("Admin Jira connection not found"));

            if (isExpired(token.getExpiryTime())) {
                refreshAdminToken(token);
            }
            // CRIT-4: Admin tokens are now stored encrypted — decrypt before use
            return encryptionUtil.decrypt(token.getAccessToken());
        } finally {
            lock.unlock();
        }
    }

    private boolean isExpired(Instant expiry) {
        return expiry == null || expiry.isBefore(Instant.now().plus(Duration.ofMinutes(5)));
    }

    private boolean isExpired(LocalDateTime expiry) {
        return expiry == null || expiry.isBefore(LocalDateTime.now().plusMinutes(5));
    }

    private void refreshUserToken(JiraUserConnection connection) {
        log.info("Refreshing user Jira token for user: {}", connection.getUserId());
        String refreshToken = encryptionUtil.decrypt(connection.getRefreshToken());
        Map<String, Object> response = callRefreshEndpoint(refreshToken);
        
        connection.setAccessToken(encryptionUtil.encrypt((String) response.get("access_token")));
        String newRefresh = (String) response.get("refresh_token");
        if (newRefresh != null) {
            connection.setRefreshToken(encryptionUtil.encrypt(newRefresh));
        }
        Integer expiresIn = (Integer) response.get("expires_in");
        connection.setExpiryTime(LocalDateTime.now().plusSeconds(expiresIn != null ? expiresIn : 3600));
        connectionRepository.save(connection);
    }

    private void refreshAdminToken(JiraOAuthToken token) {
        log.info("Refreshing admin Jira token");
        // CRIT-4: Decrypt refresh token before sending to Atlassian
        String decryptedRefresh = encryptionUtil.decrypt(token.getRefreshToken());
        Map<String, Object> response = callRefreshEndpoint(decryptedRefresh);
        
        // CRIT-4: Encrypt tokens before storage
        token.setAccessToken(encryptionUtil.encrypt((String) response.get("access_token")));
        String newRefresh = (String) response.get("refresh_token");
        if (newRefresh != null) {
            token.setRefreshToken(encryptionUtil.encrypt(newRefresh));
        }
        Integer expiresIn = (Integer) response.get("expires_in");
        token.setExpiryTime(Instant.now().plusSeconds(expiresIn != null ? expiresIn : 3600));
        tokenRepository.save(token);
    }

    private Map<String, Object> callRefreshEndpoint(String refreshToken) {
        String url = jiraConfig.getAuthUrl() + "/oauth/token";
        Map<String, String> body = Map.of(
                "grant_type", "refresh_token",
                "client_id", jiraConfig.getClientId(),
                "client_secret", jiraConfig.getClientSecret(),
                "refresh_token", refreshToken
        );

        int retries = 3;
        long waitTime = 1000;

        for (int i = 0; i < retries; i++) {
            try {
                ResponseEntity<Map> response = restTemplate.postForEntity(url, body, Map.class);
                return (Map<String, Object>) response.getBody();
            } catch (HttpStatusCodeException e) {
                if (e.getStatusCode().value() == 429) {
                    log.warn("Rate limited by Jira (429), retrying in {}ms...", waitTime);
                    try { Thread.sleep(waitTime); } catch (InterruptedException ignored) {}
                    waitTime *= 2;
                    continue;
                }
                throw e;
            }
        }
        throw new RuntimeException("Failed to refresh token after retries");
    }
}
