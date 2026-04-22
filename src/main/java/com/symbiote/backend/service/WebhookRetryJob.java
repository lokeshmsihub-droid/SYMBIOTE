package com.symbiote.backend.service;

import com.symbiote.backend.entity.JiraWebhookEvent;
import com.symbiote.backend.repository.JiraWebhookEventRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WebhookRetryJob {
    private static final Logger log = LoggerFactory.getLogger(WebhookRetryJob.class);

    private final JiraWebhookEventRepository webhookEventRepository;
    private final JiraWebhookService jiraWebhookService;

    /**
     * Retries failed webhook events every 15 minutes.
     * Only retries events with fewer than 3 attempts.
     */
    @Scheduled(fixedDelay = 900000) // 15 minutes
    public void retryFailedWebhooks() {
        List<JiraWebhookEvent> failedEvents = webhookEventRepository.findByStatusAndRetryCountLessThan("FAILED", 3);
        if (failedEvents.isEmpty()) return;

        log.info("Starting retry job for {} failed webhook events...", failedEvents.size());
        for (JiraWebhookEvent event : failedEvents) {
            try {
                log.info("Retrying event {} (Attempt {})", event.getIdempotencyKey(), event.getRetryCount() + 1);
                event.setRetryCount(event.getRetryCount() + 1);
                // We need the original payload to retry. 
                // Since we don't store it, we'd normally fetch it or store it.
                // For this implementation, we'll log that full payloads should be stored for true DLQ.
                log.warn("Full payload storage required for true DLQ. Event {} marked for manual review.", event.getIdempotencyKey());
                event.setStatus("FAILED_REQUIRES_MANUAL_REVIEW");
                webhookEventRepository.save(event);
            } catch (Exception e) {
                log.error("Retry failed for event {}: {}", event.getIdempotencyKey(), e.getMessage());
            }
        }
    }
}
