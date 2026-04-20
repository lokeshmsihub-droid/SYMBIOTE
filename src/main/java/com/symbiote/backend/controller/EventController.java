package com.symbiote.backend.controller;

import com.symbiote.backend.dto.EventRequest;
import com.symbiote.backend.dto.EventResponse;
import com.symbiote.backend.entity.Event;
import com.symbiote.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> create(@Valid @RequestBody EventRequest request) {
        Event event = eventService.createEvent(request);
        return ResponseEntity.ok(new EventResponse(event.getEventId(), "ACCEPTED"));
    }
}
