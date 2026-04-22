package com.symbiote.backend.repository;

import com.symbiote.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    java.util.Optional<User> findByEmail(String email);
    java.util.Optional<User> findByJiraAccountId(String jiraAccountId);
}
