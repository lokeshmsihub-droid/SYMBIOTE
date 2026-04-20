package com.symbiote.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class StreakEngineService {
    private final UserStateService userStateService;

    public void apply(Long userId, LocalDate today, boolean useFreeze) {
        userStateService.updateStreak(userId, today, useFreeze);
    }
}
