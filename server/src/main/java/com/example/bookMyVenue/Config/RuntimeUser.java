package com.example.bookMyVenue.Config;

import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Auth.Repository.UserRepo;
import com.example.bookMyVenue.Exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@RequiredArgsConstructor
public class RuntimeUser {
    @Autowired
    private final UserRepo userRepository;

    public String getEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public User getUser() {
        return userRepository.findByEmail(getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
}

