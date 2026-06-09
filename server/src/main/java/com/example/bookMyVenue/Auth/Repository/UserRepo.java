package com.example.bookMyVenue.Auth.Repository;

import com.example.bookMyVenue.Auth.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Long> {

}
