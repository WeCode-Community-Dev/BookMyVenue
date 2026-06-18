package com.bookmyvenue.backend.entity;

import com.bookmyvenue.backend.enums.UserRole;
import com.bookmyvenue.backend.enums.UserStatus;
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
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name",nullable = false,length = 100)
    private String firstName;

    @Column(name = "last_name",length = 100)
    private String lastName;

    @Column(name="email",nullable = false, unique = true,length = 150)
    private String email;

    @Column(name="phone",nullable = false, unique = true,length = 20)
    private String phone;

    @Column(name="password_hash",nullable = false,length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name="role",nullable = false,length = 30)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name="status",nullable = false,length = 30)
    private UserStatus status =UserStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", updatable = false)
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "state")
    private String state;

    @Column(name = "pin_code")
    private String pinCode;

    @PrePersist
    protected void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
