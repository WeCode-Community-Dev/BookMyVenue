package com.bookmyvenue.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookmyvenue.model.User;

public interface UserRepository extends JpaRepository<User, Integer > {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
