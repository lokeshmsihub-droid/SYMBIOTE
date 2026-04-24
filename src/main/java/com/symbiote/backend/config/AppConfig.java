package com.symbiote.backend.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({ScoringRulesConfig.class, JiraConfig.class, SymbioteAppConfig.class})
public class AppConfig {
}
