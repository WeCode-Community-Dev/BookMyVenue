package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.authentication.RegisterRequest;
import com.bookmyvenue.backend.dto.authentication.RegisterResponse;
import com.bookmyvenue.backend.entity.Users;
import com.bookmyvenue.backend.enums.UserRole;
import com.bookmyvenue.backend.enums.UserStatus;
import com.bookmyvenue.backend.exception.BadrequestException;
import com.bookmyvenue.backend.exception.DuplicateResourceException;
import com.bookmyvenue.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public RegisterResponse registerResponse(RegisterRequest registerRequest) {

        if(UserRole.ADMIN.equals(registerRequest.getRole())){
            throw new BadrequestException("Admin Registration is not allowed");
        }

        if(userRepository.existsByEmail(registerRequest.getEmail())){
            throw new DuplicateResourceException("Email already registered");
        }

        if(userRepository.existsByPhone(registerRequest.getPhone())){
            throw new DuplicateResourceException("Phone number already registered");
        }

        String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

        Users user = Users.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .phone(registerRequest.getPhone())
                .role(registerRequest.getRole())
                .passwordHash(encodedPassword)
                .status(UserStatus.ACTIVE)
                .createdBy(1L)
                .updatedBy(1L)
                .build();

        Users savedUser = userRepository.save(user);

        RegisterResponse registerResponse = new RegisterResponse();
        registerResponse.setUserId(savedUser.getUserId());
        registerResponse.setFirstName(savedUser.getFirstName());
        registerResponse.setLastName(savedUser.getLastName());
        registerResponse.setEmail(savedUser.getEmail());
        registerResponse.setRole(savedUser.getRole());
        registerResponse.setMessage("Successfully registered. Please login with your credentials.");

        return registerResponse;
    }


}
