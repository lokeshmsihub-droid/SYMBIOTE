package com.symbiote.backend.repository;

import com.symbiote.backend.entity.JiraWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JiraWebhookEventRepository extends JpaRepository<JiraWebhookEvent, UUID> {
    Optional<JiraWebhookEvent> findByIdempotencyKey(String idempotencyKey);
    List<JiraWebhookEvent> findByStatusAndRetryCountLessThan(String status, Integer maxRetries);
}
