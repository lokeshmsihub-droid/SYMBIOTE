package com.symbiote.backend.service;

import com.symbiote.backend.entity.UserState;
import com.symbiote.backend.repository.UserStateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserStateService {
    private final UserStateRepository userStateRepository;

    public Optional<UserState> getByUserId(Long userId) {
        return userStateRepository.findByUserId(userId);
    }

    public UserState getOrCreate(Long userId) {
        return userStateRepository.findByUserId(userId)
                .orElseGet(() -> userStateRepository.save(new UserState(
                        null, userId, 0L, 0L, 1, 0, 0, null, Instant.now(), null
                )));
    }

    @Transactional
    public UserState updateState(Long userId, long xpDelta, long coinDelta) {
        UserState state = userStateRepository.findByUserIdForUpdate(userId)
                .orElseGet(() -> new UserState(null, userId, 0L, 0L, 1, 0, 0, null, Instant.now(), null));
        state.setXp(Math.max(0, state.getXp() + xpDelta));
        state.setCoins(Math.max(0, state.getCoins() + coinDelta));
        state.setLevel(LevelCalculator.levelForXp(state.getXp()));
        state.setUpdatedAt(Instant.now());
        return userStateRepository.save(state);
    }

    @Transactional
    public UserState updateStreak(Long userId, LocalDate today, boolean useFreeze) {
        UserState state = userStateRepository.findByUserIdForUpdate(userId)
                .orElseGet(() -> new UserState(null, userId, 0L, 0L, 1, 0, 0, null, Instant.now(), null));

        LocalDate last = state.getLastActiveDate();
        if (last == null) {
            state.setCurrentStreak(1);
        } else if (last.isEqual(today)) {
            // no-op
        } else if (last.plusDays(1).isEqual(today)) {
            state.setCurrentStreak(state.getCurrentStreak() + 1);
        } else {
            if (!useFreeze) {
                state.setCurrentStreak(1);
            }
        }

        if (state.getCurrentStreak() > state.getLongestStreak()) {
            state.setLongestStreak(state.getCurrentStreak());
        }
        state.setLastActiveDate(today);
        state.setUpdatedAt(Instant.now());
        return userStateRepository.save(state);
    }

    public UserState save(UserState userState) {
        return userStateRepository.save(userState);
    }
}
