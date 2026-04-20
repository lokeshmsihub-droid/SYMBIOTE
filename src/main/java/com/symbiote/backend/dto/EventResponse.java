package com.symbiote.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class EventResponse {
    private UUID eventId;
    private String status;
}
