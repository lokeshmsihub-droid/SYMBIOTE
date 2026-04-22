package com.symbiote.backend.config;

import com.symbiote.backend.entity.User;
import com.symbiote.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Database is empty. Seeding default users...");

            // Create Admin
            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@symbiote.ai")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .department("IT")
                    .status("ACTIVE")
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            log.info("Default admin created: admin@symbiote.ai / admin123");

            // Create Sample Employee
            User employee = User.builder()
                    .name("Alice Employee")
                    .email("alice@sample.com")
                    .password(passwordEncoder.encode("alice123"))
                    .role("USER")
                    .department("Engineering")
                    .status("ACTIVE")
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(employee);
            log.info("Sample employee created: alice@sample.com / alice123");
        } else {
            log.info("Database already contains users. Skipping seeding.");
        }
    }
}
