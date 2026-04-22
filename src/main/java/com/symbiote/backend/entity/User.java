package com.symbiote.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // ADMIN / USER

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String status; // ACTIVE / INACTIVE

    @Column(name = "lifetime_xp", nullable = false)
    private Long lifetimeXp = 0L;

    @Column(name = "weekly_xp", nullable = false)
    private Long weeklyXp = 0L;

    @Column(name = "jira_account_id")
    private String jiraAccountId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public User() {}

    public User(Long id, String name, String email, String password, String role, String department, String status, Long lifetimeXp, Long weeklyXp, String jiraAccountId, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.status = status;
        this.lifetimeXp = lifetimeXp != null ? lifetimeXp : 0L;
        this.weeklyXp = weeklyXp != null ? weeklyXp : 0L;
        this.jiraAccountId = jiraAccountId;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private String role;
        private String department;
        private String status;
        private Long lifetimeXp;
        private Long weeklyXp;
        private String jiraAccountId;
        private LocalDateTime createdAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder role(String role) { this.role = role; return this; }
        public UserBuilder department(String department) { this.department = department; return this; }
        public UserBuilder status(String status) { this.status = status; return this; }
        public UserBuilder lifetimeXp(Long lifetimeXp) { this.lifetimeXp = lifetimeXp; return this; }
        public UserBuilder weeklyXp(Long weeklyXp) { this.weeklyXp = weeklyXp; return this; }
        public UserBuilder jiraAccountId(String jiraAccountId) { this.jiraAccountId = jiraAccountId; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, name, email, password, role, department, status, lifetimeXp, weeklyXp, jiraAccountId, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getLifetimeXp() { return lifetimeXp; }
    public void setLifetimeXp(Long lifetimeXp) { this.lifetimeXp = lifetimeXp; }
    public Long getWeeklyXp() { return weeklyXp; }
    public void setWeeklyXp(Long weeklyXp) { this.weeklyXp = weeklyXp; }
    public String getJiraAccountId() { return jiraAccountId; }
    public void setJiraAccountId(String jiraAccountId) { this.jiraAccountId = jiraAccountId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
