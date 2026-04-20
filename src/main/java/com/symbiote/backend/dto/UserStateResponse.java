package com.symbiote.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStateResponse {
    private long xp;
    private long coins;
    private int level;
    private int currentStreak;
    private int longestStreak;
}
