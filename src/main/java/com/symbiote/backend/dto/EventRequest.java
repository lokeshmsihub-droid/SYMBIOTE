package com.symbiote.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.Map;

@Data
public class EventRequest {
    @NotBlank
    private String type;

    @NotNull
    private Long userId;

    private Instant occurredAt;

    private Map<String, Object> metadata;

    private String idempotencyKey;
}
