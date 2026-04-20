package com.symbiote.backend.controller;

import com.symbiote.backend.entity.Achievement;
import com.symbiote.backend.repository.AchievementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {
    private final AchievementRepository achievementRepository;

    @GetMapping
    public ResponseEntity<List<Achievement>> list() {
        return ResponseEntity.ok(achievementRepository.findAll());
    }
}
