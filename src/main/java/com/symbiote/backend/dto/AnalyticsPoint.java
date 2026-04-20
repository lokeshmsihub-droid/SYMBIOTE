package com.symbiote.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnalyticsPoint {
    private String day;
    private long value;
}
