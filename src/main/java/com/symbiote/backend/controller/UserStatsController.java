package com.symbiote.backend.controller;

import com.symbiote.backend.dto.UserStatsResponse;
import com.symbiote.backend.entity.User;
import com.symbiote.backend.repository.TaskRepository;
import com.symbiote.backend.repository.UserRepository;
import com.symbiote.backend.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserStatsController {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final LeaderboardService leaderboardService;

    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponse> getMyStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        long tasksCompleted = taskRepository.countByUserIdAndStatus(user.getId(), "DONE");
        long tasksInProgress = taskRepository.countByUserIdAndStatus(user.getId(), "IN_PROGRESS");
        long tasksTodo = taskRepository.countByUserIdAndStatus(user.getId(), "TODO");

        int rank = leaderboardService.getUserRank(user.getId());

        UserStatsResponse stats = UserStatsResponse.builder()
                .currentXp(user.getLifetimeXp())
                .weeklyXp(user.getWeeklyXp())
                .rank(rank)
                .tasksCompleted(tasksCompleted)
                .activeTasks(tasksInProgress + tasksTodo)
                .build();

        return ResponseEntity.ok(stats);
    }
}
