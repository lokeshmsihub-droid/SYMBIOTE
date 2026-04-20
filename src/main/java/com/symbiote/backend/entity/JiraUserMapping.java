package com.symbiote.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "jira_user_mapping", uniqueConstraints = {
        @UniqueConstraint(name = "uq_jira_user_mapping", columnNames = {"symbioteUserId", "jiraAccountId"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JiraUserMapping {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private Long symbioteUserId;

    @Column(nullable = false)
    private String jiraAccountId;

    @Column(nullable = false)
    private Instant createdAt;
}
