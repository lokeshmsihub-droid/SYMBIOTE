package com.symbiote.backend.service;

import com.symbiote.backend.entity.Redemption;
import com.symbiote.backend.entity.Reward;
import com.symbiote.backend.entity.UserState;
import com.symbiote.backend.repository.RedemptionRepository;
import com.symbiote.backend.repository.RewardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RewardService {
    private final RewardRepository rewardRepository;
    private final RedemptionRepository redemptionRepository;
    private final UserStateService userStateService;
    private final LedgerTransactionRepositoryAdapter ledgerAdapter;

    public List<Reward> listActiveRewards() {
        return rewardRepository.findByActiveTrue();
    }

    @Transactional
    public Redemption redeem(Long userId, UUID rewardId) {
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new IllegalArgumentException("Reward not found"));
        if (!reward.isActive()) {
            throw new IllegalStateException("Reward is inactive");
        }
        if (reward.getInventory() <= 0) {
            throw new IllegalStateException("Reward out of stock");
        }

        UserState state = userStateService.updateState(userId, 0, 0);
        if (state.getCoins() < reward.getCost()) {
            throw new IllegalStateException("Insufficient coins");
        }

        reward.setInventory(reward.getInventory() - 1);
        rewardRepository.save(reward);

        userStateService.updateState(userId, 0, -reward.getCost());
        ledgerAdapter.record(userId, "REWARD_REDEEMED", reward.getCost(), "COIN",
                "{\"rewardId\":\"" + reward.getId() + "\"}");

        return redemptionRepository.save(Redemption.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .rewardId(rewardId)
                .cost(reward.getCost())
                .createdAt(Instant.now())
                .build());
    }
}
