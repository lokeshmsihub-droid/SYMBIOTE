package com.symbiote.backend.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "symbiote.leaderboard.redis-enabled", havingValue = "true")
public class RedisLeaderboardUpdateService implements LeaderboardUpdateService {
    private final StringRedisTemplate redisTemplate;

    public RedisLeaderboardUpdateService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void update(Long userId, long xp) {
        redisTemplate.opsForZSet().add("leaderboard:weekly", String.valueOf(userId), xp);
    }
}
