package com.symbiote.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotNull
    private Long userId;
    private long xpDelta;
    private long coinDelta;
}
