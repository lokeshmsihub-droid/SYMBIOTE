package com.symbiote.backend.controller;

import com.symbiote.backend.dto.AnalyticsPoint;
import com.symbiote.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @GetMapping("/xp-trend")
    public ResponseEntity<List<AnalyticsPoint>> xpTrend(@RequestParam Long userId) {
        return ResponseEntity.ok(analyticsService.xpTrend(userId));
    }
}
