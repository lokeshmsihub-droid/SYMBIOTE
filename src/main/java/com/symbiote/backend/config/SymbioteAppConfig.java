package com.symbiote.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "symbiote.app")
public class SymbioteAppConfig {
    private String baseUrl;
    private String frontendUrl;
}
