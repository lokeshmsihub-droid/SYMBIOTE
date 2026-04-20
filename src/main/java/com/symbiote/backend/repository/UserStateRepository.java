package com.symbiote.backend.repository;

import com.symbiote.backend.entity.UserState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStateRepository extends JpaRepository<UserState, Long> {
    Optional<UserState> findByUserId(Long userId);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select us from UserState us where us.userId = :userId")
    Optional<UserState> findByUserIdForUpdate(@org.springframework.data.repository.query.Param("userId") Long userId);
}
