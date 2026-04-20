package com.symbiote.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminTaskRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Long assigneeUserId;

    @NotNull
    private Long sprintId;

    @NotBlank
    private String priority;

    @Min(0)
    private Integer storyPoints;
}
