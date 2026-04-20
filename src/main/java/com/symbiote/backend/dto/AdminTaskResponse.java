package com.symbiote.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AdminTaskResponse {
    private UUID taskId;
    private String jiraIssueKey;
    private String status;
    private String message;
}
