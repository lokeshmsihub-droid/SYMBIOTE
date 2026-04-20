package com.symbiote.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class RewardRedeemRequest {
    @NotNull
    private Long userId;
    @NotNull
    private UUID rewardId;
}
