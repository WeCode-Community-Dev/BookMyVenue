package com.bookmyvenue.server.user.entity;

import com.bookmyvenue.server.user.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users") // Maps this entity to the 'users' table in PostgreSQL
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Auto-generates a unique UUID for each user
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // USER, VENDOR, or ADMIN

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // Record creation timestamp

    @Column(nullable = false)
    private LocalDateTime updatedAt; // Last update timestamp

    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(nullable = false)
    private boolean phoneVerified = false;

    /**
     * Automatically sets creation and update timestamps
     * before the entity is inserted into the database.
     */
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    /**
     * Automatically updates the updatedAt timestamp
     * whenever the entity is modified.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
