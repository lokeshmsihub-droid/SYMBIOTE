package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "mapping_audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MappingAuditLog {

    @Id
    private UUID id;

    @Column(nullable = false)
    private Long adminId;

    @Column(nullable = false)
    private Long userId;

    private String oldAccountId;
    private String newAccountId;

    @Column(nullable = false)
    private String action; // e.g. "MANUAL_MAP", "DISCONNECT"

    @Column(nullable = false)
    private Instant timestamp;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (timestamp == null) timestamp = Instant.now();
    }
}
