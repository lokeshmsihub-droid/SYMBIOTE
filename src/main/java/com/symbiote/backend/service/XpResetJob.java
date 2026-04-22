package com.symbiote.backend.service;

import com.symbiote.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class XpResetJob {
    private static final Logger log = LoggerFactory.getLogger(XpResetJob.class);

    private final UserRepository userRepository;

    /**
     * Resets weekly XP for all users every Sunday at midnight.
     */
    @Scheduled(cron = "0 0 0 * * SUN")
    @Transactional
    public void resetWeeklyXp() {
        log.info("Starting weekly XP reset job...");
        userRepository.findAll().forEach(user -> {
            user.setWeeklyXp(0L);
            userRepository.save(user);
        });
        log.info("Weekly XP reset completed successfully.");
    }
}
