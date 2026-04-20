package com.symbiote.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JiraWebhookResponse {
    private String status;
}
