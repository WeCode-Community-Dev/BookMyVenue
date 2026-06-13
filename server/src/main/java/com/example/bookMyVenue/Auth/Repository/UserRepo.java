package com.example.bookMyVenue.Auth.Repository;

import com.example.bookMyVenue.Auth.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {

    boolean existsByUserName(String email);
    User findByUserName(String email);

}
