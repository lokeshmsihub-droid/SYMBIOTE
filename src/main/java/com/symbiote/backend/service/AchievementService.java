package com.symbiote.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.symbiote.backend.entity.Achievement;
import com.symbiote.backend.entity.Event;
import com.symbiote.backend.entity.UserAchievement;
import com.symbiote.backend.entity.UserState;
import com.symbiote.backend.repository.AchievementRepository;
import com.symbiote.backend.repository.UserAchievementRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AchievementService {
    private static final Logger log = LoggerFactory.getLogger(AchievementService.class);

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void evaluate(Event event, UserState state) {
        List<Achievement> achievements = achievementRepository.findAll();
        for (Achievement achievement : achievements) {
            if (isUnlocked(state, event, achievement)) {
                unlockIfMissing(state.getUserId(), achievement.getId());
            }
        }
    }

    private boolean isUnlocked(UserState state, Event event, Achievement achievement) {
        Map<String, Object> rule = parseRule(achievement.getRuleJson());
        String type = String.valueOf(rule.getOrDefault("type", ""));
        int threshold = Integer.parseInt(String.valueOf(rule.getOrDefault("threshold", "0")));

        return switch (type) {
            case "STREAK_REACHED" -> state.getCurrentStreak() >= threshold;
            case "XP_REACHED" -> state.getXp() >= threshold;
            case "COINS_REACHED" -> state.getCoins() >= threshold;
            case "EVENT_TYPE" -> event.getType().equalsIgnoreCase(String.valueOf(rule.get("event")));
            default -> false;
        };
    }

    private Map<String, Object> parseRule(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return Map.of();
        }
    }

    private void unlockIfMissing(Long userId, UUID achievementId) {
        userAchievementRepository.findByUserIdAndAchievementId(userId, achievementId)
                .orElseGet(() -> userAchievementRepository.save(UserAchievement.builder()
                        .id(UUID.randomUUID())
                        .userId(userId)
                        .achievementId(achievementId)
                        .unlockedAt(Instant.now())
                        .build()));
    }
}
