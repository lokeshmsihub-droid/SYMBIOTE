package com.symbiote.backend.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
@ConditionalOnProperty(name = "symbiote.leaderboard.redis-enabled", havingValue = "false", matchIfMissing = true)
public class InMemoryLeaderboardUpdateService implements LeaderboardUpdateService {
    private final ConcurrentMap<Long, Long> scores = new ConcurrentHashMap<>();

    @Override
    public void update(Long userId, long xp) {
        scores.put(userId, xp);
    }
}
