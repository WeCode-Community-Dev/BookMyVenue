package com.bookmyvenue.server.user.repository;

import com.bookmyvenue.server.user.entity.User;
import com.bookmyvenue.server.user.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Finds a user by email address.
     * Used during authentication and login.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks whether an email is already registered.
     * Used during user registration.
     */
    boolean existsByEmail(String email);

    /**
     * Checks whether a phone number is already registered.
     * Used during user registration.
     */
    boolean existsByPhone(String phone);

    UUID id(UUID id);

    /**
     * To check by role of the user
     * @param role
     * @return
     */
    long countByRole(Role role);


    Page<User> findByRole(Role role, Pageable pageable);
}