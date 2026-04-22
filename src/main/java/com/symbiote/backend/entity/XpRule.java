package com.symbiote.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "xp_rules")
public class XpRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String status; // e.g. DONE, IN_PROGRESS

    @Column(nullable = false)
    private Integer points;

    public XpRule() {}

    public XpRule(Long id, String status, Integer points) {
        this.id = id;
        this.status = status;
        this.points = points;
    }

    public static XpRuleBuilder builder() {
        return new XpRuleBuilder();
    }

    public static class XpRuleBuilder {
        private Long id;
        private String status;
        private Integer points;

        public XpRuleBuilder id(Long id) { this.id = id; return this; }
        public XpRuleBuilder status(String status) { this.status = status; return this; }
        public XpRuleBuilder points(Integer points) { this.points = points; return this; }

        public XpRule build() {
            return new XpRule(id, status, points);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
}
