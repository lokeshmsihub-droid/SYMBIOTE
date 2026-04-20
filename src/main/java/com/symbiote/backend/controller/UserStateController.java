package com.symbiote.backend.controller;

import com.symbiote.backend.dto.UserStateResponse;
import com.symbiote.backend.dto.UserUpdateRequest;
import com.symbiote.backend.entity.UserState;
import com.symbiote.backend.service.UserStateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserStateController {
    private final UserStateService userStateService;

    @GetMapping("/state")
    public ResponseEntity<UserStateResponse> getState(@RequestParam Long userId) {
        UserState state = userStateService.getOrCreate(userId);
        return ResponseEntity.ok(new UserStateResponse(
                state.getXp(), state.getCoins(), state.getLevel(), state.getCurrentStreak(), state.getLongestStreak()
        ));
    }

    @PostMapping("/update")
    public ResponseEntity<UserStateResponse> update(@Valid @RequestBody UserUpdateRequest request) {
        UserState state = userStateService.updateState(request.getUserId(), request.getXpDelta(), request.getCoinDelta());
        return ResponseEntity.ok(new UserStateResponse(
                state.getXp(), state.getCoins(), state.getLevel(), state.getCurrentStreak(), state.getLongestStreak()
        ));
    }
}
