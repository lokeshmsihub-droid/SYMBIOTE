package com.symbiote.backend.service;

import com.symbiote.backend.entity.JiraOAuthToken;
import com.symbiote.backend.repository.JiraOAuthTokenRepository;
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

    private final JiraOAuthTokenRepository tokenRepository;
    
    // Configured RestTemplate with production timeout bounds
    private final RestTemplate restTemplate = new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();

    @Transactional
    public JiraOAuthToken exchangeCodeForToken(String code) {
        String tokenUrl = "https://auth.atlassian.com/oauth/token";

        Map<String, String> body = Map.of(
                "grant_type", "authorization_code",
                "client_id", clientId,
                "client_secret", clientSecret,
                "code", code,
                "redirect_uri", redirectUri
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, new HttpEntity<>(body, headers), Map.class);
            Map<?, ?> responseBody = response.getBody();
            
            if (responseBody == null || !responseBody.containsKey("access_token")) {
                throw new IllegalStateException("Atlassian returned empty or invalid token payload");
            }

            String accessToken = (String) responseBody.get("access_token");
            String refreshToken = (String) responseBody.get("refresh_token");
            Integer expiresIn = (Integer) responseBody.get("expires_in");

            // Fetch Cloud ID safely
            Map<String, String> cloudDetails = fetchCloudIdAndUrl(accessToken);

            // Upsert Logic
            JiraOAuthToken token = tokenRepository.findByEnvironment("DEFAULT_WORKSPACE")
                    .orElse(new JiraOAuthToken());
            
            token.setEnvironment("DEFAULT_WORKSPACE");
            token.setAccessToken(accessToken);
            token.setRefreshToken(refreshToken);
            token.setCloudId(cloudDetails.get("id"));
            token.setSiteUrl(cloudDetails.get("url"));
            token.setExpiryTime(Instant.now().plusSeconds(expiresIn != null ? expiresIn : 3600));

            tokenRepository.save(token);
            log.info("Successfully persisted Jira OAuth Token for Cloud ID: {}", token.getCloudId());

            return token;

        } catch (HttpStatusCodeException e) {
            log.error("Jira OAuth HTTP Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("OAuth exchange failed with Atlassian servers", e);
        } catch (Exception e) {
            log.error("Unexpected error during OAuth token exchange", e);
            throw new RuntimeException("OAuth exchange processing failed", e);
        }
    }

    private Map<String, String> fetchCloudIdAndUrl(String accessToken) {
        String resourceUrl = "https://api.atlassian.com/oauth/token/accessible-resources";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        try {
            ResponseEntity<List> response = restTemplate.exchange(
                    resourceUrl, HttpMethod.GET, new HttpEntity<>(headers), List.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && !response.getBody().isEmpty()) {
                Map<?, ?> site = (Map<?, ?>) response.getBody().get(0);
                return Map.of(
                        "id", (String) site.get("id"),
                        "url", (String) site.get("url")
                );
            }
            throw new IllegalStateException("User has zero accessible Jira sites or response is malformed");
        } catch (HttpStatusCodeException e) {
            log.error("Failed fetching accessible resources: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Failure contacting Atlassian Accessible Resources API");
        }
    }
}
