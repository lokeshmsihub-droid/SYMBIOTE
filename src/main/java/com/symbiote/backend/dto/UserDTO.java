package com.symbiote.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;

    @JsonIgnore
    private String password;

    /**
     * Allow password to be received on input (registration),
     * but never include it in API responses.
     */
    @JsonProperty("password")
    public void setPassword(String password) {
        this.password = password;
    }

    private String role;
    private String department;
    private String status;
    private LocalDateTime createdAt;
}
