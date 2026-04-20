package com.symbiote.backend.service;

import com.symbiote.backend.config.ScoringRulesConfig;
import com.symbiote.backend.dto.EventRequest;
import com.symbiote.backend.entity.UserState;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScoringService {
    private final ScoringRulesConfig rules;

    public long calculateXp(EventRequest event, UserState state) {
        long base = rules.getBaseXp();
        double difficulty = 1.0;
        if (event.getMetadata() != null && event.getMetadata().get("difficulty") != null) {
            String diff = String.valueOf(event.getMetadata().get("difficulty")).toUpperCase();
            difficulty = rules.getDifficulty().getOrDefault(diff, 1.0);
        }
        double streakMultiplier = state.getCurrentStreak() >= rules.getStreakBonus().getThreshold()
                ? rules.getStreakBonus().getMultiplier() : 1.0;
        return Math.round(base * difficulty * streakMultiplier);
    }
}
