package com.symbiote.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI symbioteOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SYMBIOTE API")
                        .description("Backend Admin Panel for managing Jira-integrated gamification endpoints.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SYMBIOTE Dev Team")
                                .email("admin@symbiote.com")));
    }
}
