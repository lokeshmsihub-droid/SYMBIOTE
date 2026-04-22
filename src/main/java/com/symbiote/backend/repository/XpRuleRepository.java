package com.symbiote.backend.repository;

import com.symbiote.backend.entity.XpRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface XpRuleRepository extends JpaRepository<XpRule, Long> {
    Optional<XpRule> findByStatus(String status);
}
