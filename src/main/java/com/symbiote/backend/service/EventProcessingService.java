package com.symbiote.backend.service;

import com.symbiote.backend.dto.EventRequest;
import com.symbiote.backend.entity.Event;
import com.symbiote.backend.entity.UserState;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneOffset;

@Service
@RequiredArgsConstructor
public class EventProcessingService {
    private static final Logger log = LoggerFactory.getLogger(EventProcessingService.class);

    private final UserStateService userStateService;
    private final ScoringService scoringService;
    private final StreakEngineService streakEngineService;
    private final AchievementService achievementService;
    private final AnalyticsService analyticsService;
    private final LedgerTransactionRepositoryAdapter ledgerAdapter;
    private final LeaderboardUpdateService leaderboardUpdateService;
    private final EventService eventService;

    @Transactional
    public void processEvent(Event event, EventRequest request) {
        log.info("Processing event {} type {}", event.getEventId(), event.getType());

        UserState state = userStateService.getOrCreate(event.getUserId());
        long xp = scoringService.calculateXp(request, state);
        long coins = Math.max(1, xp / 5); // economy rule: 20% of XP in coins

        streakEngineService.apply(event.getUserId(), event.getOccurredAt().atZone(ZoneOffset.UTC).toLocalDate(), false);
        UserState updated = userStateService.updateState(event.getUserId(), xp, coins);

        ledgerAdapter.record(event.getUserId(), "XP_EARNED", xp, "XP", "{\"eventId\":\"" + event.getEventId() + "\"}");
        ledgerAdapter.record(event.getUserId(), "COIN_EARNED", coins, "COIN", "{\"eventId\":\"" + event.getEventId() + "\"}");

        achievementService.evaluate(event, updated);
        analyticsService.record(event, xp, coins);
        leaderboardUpdateService.update(event.getUserId(), updated.getXp());

        eventService.markProcessed(event.getEventId());
    }
}
