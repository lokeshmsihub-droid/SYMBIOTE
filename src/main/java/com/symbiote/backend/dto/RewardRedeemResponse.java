package com.symbiote.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class RewardRedeemResponse {
    private UUID redemptionId;
    private long remainingCoins;
}
