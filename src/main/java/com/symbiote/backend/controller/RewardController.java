package com.symbiote.backend.controller;

import com.symbiote.backend.dto.RewardRedeemRequest;
import com.symbiote.backend.dto.RewardRedeemResponse;
import com.symbiote.backend.entity.Redemption;
import com.symbiote.backend.entity.Reward;
import com.symbiote.backend.entity.UserState;
import com.symbiote.backend.service.RewardService;
import com.symbiote.backend.service.UserStateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {
    private final RewardService rewardService;
    private final UserStateService userStateService;

    @GetMapping
    public ResponseEntity<List<Reward>> list() {
        return ResponseEntity.ok(rewardService.listActiveRewards());
    }

    @PostMapping("/redeem")
    public ResponseEntity<RewardRedeemResponse> redeem(@Valid @RequestBody RewardRedeemRequest request) {
        Redemption redemption = rewardService.redeem(request.getUserId(), request.getRewardId());
        UserState state = userStateService.getOrCreate(request.getUserId());
        return ResponseEntity.ok(new RewardRedeemResponse(redemption.getId(), state.getCoins()));
    }
}
