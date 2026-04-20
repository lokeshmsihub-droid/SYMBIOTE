package com.symbiote.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String role;
    private String department;
    private String status;
    private LocalDateTime createdAt;
}
