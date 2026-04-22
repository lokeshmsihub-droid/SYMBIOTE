package com.symbiote.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatsResponse {
    private Long currentXp;
    private Long weeklyXp;
    private Integer rank;
    private Long tasksCompleted;
    private Long activeTasks;
}
