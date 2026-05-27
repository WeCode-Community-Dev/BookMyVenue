package com.example.bookMyVenue.Auth.Model;

import com.example.bookMyVenue.Enums.Role;
import com.example.bookMyVenue.Enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "bmv_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private Role role;
    private boolean isEmailVerified;
    private UserStatus status;
    private LocalDateTime createdAt;
}
