package com.symbiote.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.symbiote.backend.dto.EventRequest;
import com.symbiote.backend.entity.Event;
import com.symbiote.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {
    private static final Logger log = LoggerFactory.getLogger(EventService.class);

    private final EventRepository eventRepository;
    @Lazy
    private final EventProcessingService processingService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public Event createEvent(EventRequest request) {
        String idemKey = request.getIdempotencyKey();
        if (idemKey == null || idemKey.isBlank()) {
            idemKey = buildIdempotencyKey(request);
        }

        eventRepository.findByIdempotencyKey(idemKey).ifPresent(existing -> {
            throw new DuplicateEventException(existing.getEventId());
        });

        String payload = toJson(request.getMetadata());
        Event event = Event.builder()
                .eventId(UUID.randomUUID())
                .userId(request.getUserId())
                .type(request.getType())
                .occurredAt(request.getOccurredAt() != null ? request.getOccurredAt() : Instant.now())
                .payload(payload)
                .idempotencyKey(idemKey)
                .build();
        eventRepository.save(event);

        processingService.processEvent(event, request);
        return event;
    }

    private String buildIdempotencyKey(EventRequest request) {
        return request.getUserId() + ":" + request.getType() + ":" + (request.getOccurredAt() != null ? request.getOccurredAt().toString() : "now");
    }

    private String toJson(Object payload) {
        if (payload == null) return "{}";
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }

    @Transactional
    public void markProcessed(UUID eventId) {
        eventRepository.findById(eventId).ifPresent(event -> {
            event.setProcessedAt(Instant.now());
            eventRepository.save(event);
        });
    }

    public static class DuplicateEventException extends RuntimeException {
        private final UUID eventId;
        public DuplicateEventException(UUID eventId) {
            super("Duplicate event");
            this.eventId = eventId;
        }
        public UUID getEventId() { return eventId; }
    }
}
