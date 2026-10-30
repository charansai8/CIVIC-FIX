package com.civicfix.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, unique = true, length = 60)
    private String username;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "mobile_number", length = 25)
    private String mobileNumber;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "account_status", nullable = false, length = 20)
    private String accountStatus;

    @Column(name = "two_factor_enabled", nullable = false)
    private Boolean twoFactorEnabled;

    @Column(name = "two_factor_secret", length = 64)
    private String twoFactorSecret;

    @Column(name = "avatar_url")
    private String avatarUrl;

    private String ward;
    private String city;
    private String state;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    public enum Role {
        USER,
        ADMIN
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.accountStatus == null) {
            this.accountStatus = "active";
        }
        if (this.twoFactorEnabled == null) {
            this.twoFactorEnabled = true;
        }
    }
}
