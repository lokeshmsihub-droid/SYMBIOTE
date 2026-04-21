package com.symbiote.backend.repository;

import com.symbiote.backend.entity.JiraOAuthToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JiraOAuthTokenRepository extends JpaRepository<JiraOAuthToken, Long> {
    Optional<JiraOAuthToken> findByEnvironment(String environment);
}
