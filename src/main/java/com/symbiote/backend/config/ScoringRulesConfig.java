package com.symbiote.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

@Data
@ConfigurationProperties(prefix = "symbiote.scoring")
public class ScoringRulesConfig {
    private long baseXp = 10;
    private Map<String, Double> difficulty = new HashMap<>();
    private StreakBonus streakBonus = new StreakBonus();

    @Data
    public static class StreakBonus {
        private int threshold = 7;
        private double multiplier = 1.3;
    }
}
