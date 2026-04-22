package com.symbiote.backend.repository;

import com.symbiote.backend.entity.UnmappedWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface UnmappedWebhookEventRepository extends JpaRepository<UnmappedWebhookEvent, UUID> {
}
