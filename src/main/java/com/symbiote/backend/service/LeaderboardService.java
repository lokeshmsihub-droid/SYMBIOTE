package com.symbiote.backend.service;

import com.symbiote.backend.dto.LeaderboardEntryDto;
import com.symbiote.backend.entity.User;
import com.symbiote.backend.entity.UserState;
import com.symbiote.backend.repository.UserRepository;
import com.symbiote.backend.repository.UserStateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {
    private final UserRepository userRepository;
    private final UserStateRepository userStateRepository;

    private List<LeaderboardEntryDto> buildLeaderboard(List<UserState> states, Optional<String> roleFilter, int limit) {
        List<LeaderboardEntryDto> entries = states.stream()
                .map(state -> {
                    User user = userRepository.findById(state.getUserId()).orElse(null);
                    if (user == null) return null;
                    if (roleFilter.isPresent() && !roleFilter.get().equalsIgnoreCase(user.getRole())) return null;
                    return new LeaderboardEntryDto(
                            user.getId(),
                            user.getName(),
                            state.getXp(),
                            state.getLevel(),
                            state.getCurrentStreak(),
                            0 // rank placeholder
                    );
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingLong(LeaderboardEntryDto::getXp).reversed())
                .collect(Collectors.toList());
        // Assign ranks
        for (int i = 0; i < entries.size(); i++) {
            entries.get(i).setRank(i + 1);
        }
        if (limit > 0 && entries.size() > limit) {
            return entries.subList(0, limit);
        }
        return entries;
    }

    public List<LeaderboardEntryDto> getLeaderboard() {
        return buildLeaderboard(userStateRepository.findAll(), Optional.empty(), 0);
    }

    public List<LeaderboardEntryDto> getTop10() {
        return buildLeaderboard(userStateRepository.findAll(), Optional.empty(), 10);
    }

    public List<LeaderboardEntryDto> getByRole(String role) {
        return buildLeaderboard(userStateRepository.findAll(), Optional.of(role), 0);
    }
}
