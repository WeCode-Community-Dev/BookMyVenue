package com.bookmyvenue.backend.repository;

import com.bookmyvenue.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String Email);
    boolean existsByEmail(String Email);
    boolean existsByPhone(String Phone);


}
