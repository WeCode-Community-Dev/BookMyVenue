package com.bookmyvenue.backend.repository;

import com.bookmyvenue.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> , JpaSpecificationExecutor<Users> {

    Optional<Users> findByEmail(String Email);
    boolean existsByEmail(String Email);
    boolean existsByPhone(String Phone);
    List<Users> findByFirstNameContainingIgnoreCase(
            String name);

    List<Users> findByEmailContainingIgnoreCase(
            String email);

}
