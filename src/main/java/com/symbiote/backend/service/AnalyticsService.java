package com.symbiote.backend.service;

import com.symbiote.backend.dto.AnalyticsPoint;
import com.symbiote.backend.entity.Event;
import com.symbiote.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final EventRepository eventRepository;

    public void record(Event event, long xp, long coins) {
        // Placeholder for streaming analytics sink
    }

    public List<AnalyticsPoint> xpTrend(Long userId) {
        DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE;
        Map<String, Long> totals = new TreeMap<>();
        for (Event event : eventRepository.findAll()) {
            if (!Objects.equals(event.getUserId(), userId)) continue;
            String day = event.getOccurredAt().atZone(ZoneOffset.UTC).toLocalDate().format(fmt);
            totals.put(day, totals.getOrDefault(day, 0L) + 1);
        }
        List<AnalyticsPoint> points = new ArrayList<>();
        totals.forEach((day, value) -> points.add(new AnalyticsPoint(day, value)));
        return points;
    }
}
