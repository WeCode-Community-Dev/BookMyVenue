package com.example.bookMyVenue.Dev;

import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Auth.Repository.UserRepo;
import com.example.bookMyVenue.Enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void run(String... args) {

        createUserIfNotExists(
                "admin@bookmyvenue.com",
                "admin123",
                "Admin",
                Role.ADMIN);

        createUserIfNotExists(
                "owner@bookmyvenue.com",
                "owner123",
                "Venue Owner",
                Role.VENUE_OWNER);


        createUserIfNotExists(
                "user@bookmyvenue.com",
                "user123",
                "Test User",
                Role.USER);
        createUserIfNotExists(
                "customer@bookmyvenue.com",
                "customer123",
                "Test User 2",
                Role.USER);
    }

    private void createUserIfNotExists(
            String email,
            String password,
            String name,
            Role role) {

        if (!userRepository.existsByEmail(email)) {

            User user = new User();
            user.setFullName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);

            userRepository.save(user);
        }
    }
}
