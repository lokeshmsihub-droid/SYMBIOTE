package com.symbiote.backend.config;

import com.symbiote.backend.entity.XpRule;
import com.symbiote.backend.repository.XpRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class XpRuleInitializer implements CommandLineRunner {

    private final XpRuleRepository xpRuleRepository;

    @Override
    public void run(String... args) {
        if (xpRuleRepository.count() == 0) {
            List<XpRule> defaultRules = List.of(
                    XpRule.builder().status("DONE").points(50).build(),
                    XpRule.builder().status("IN_PROGRESS").points(10).build(),
                    XpRule.builder().status("REOPENED").points(-20).build()
            );
            xpRuleRepository.saveAll(defaultRules);
        }
    }
}
