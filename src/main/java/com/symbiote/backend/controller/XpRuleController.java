package com.symbiote.backend.controller;

import com.symbiote.backend.entity.XpRule;
import com.symbiote.backend.repository.XpRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/xp-rules")
@RequiredArgsConstructor
public class XpRuleController {

    private final XpRuleRepository xpRuleRepository;

    @GetMapping
    public ResponseEntity<List<XpRule>> list() {
        return ResponseEntity.ok(xpRuleRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<XpRule> update(@PathVariable Long id, @RequestBody XpRule request) {
        XpRule rule = xpRuleRepository.findById(id).orElseThrow();
        rule.setPoints(request.getPoints());
        return ResponseEntity.ok(xpRuleRepository.save(rule));
    }
}
