package com.symbiote.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardEntryDto {
    private Long userId;
    private String name;
    private long xp;
    private int level;
    private int streak;
    private int rank;
}
