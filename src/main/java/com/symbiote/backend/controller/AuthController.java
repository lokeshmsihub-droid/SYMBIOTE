package com.symbiote.backend.controller;

import com.symbiote.backend.dto.LoginRequest;
import com.symbiote.backend.dto.LoginResponse;
import com.symbiote.backend.dto.UserDTO;
import com.symbiote.backend.entity.User;
import com.symbiote.backend.repository.UserRepository;
import com.symbiote.backend.security.JwtUtil;
import com.symbiote.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        log.info("Registration attempt for email: {}", userDTO.getEmail());
        if (userDTO.getEmail() == null || userDTO.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            log.warn("Registration failed - Email already exists: {}", userDTO.getEmail());
            return ResponseEntity.badRequest().body("Email already exists");
        }
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userDTO.setStatus("ACTIVE");
        UserDTO created = userService.createUser(userDTO);
        log.info("User registered successfully: {}", created.getEmail());
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));
            
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName());
            log.info("Login successful for user: {}", user.getEmail());
            return ResponseEntity.ok(new LoginResponse(token, user.getName(), user.getRole()));
        } catch (AuthenticationException e) {
            log.warn("Login failed for email: {} - {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(userService.toDTO(user));
    }
}
