package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.authentication.LoginRequest;
import com.bookmyvenue.backend.dto.authentication.LoginResponse;
import com.bookmyvenue.backend.dto.authentication.RegisterRequest;
import com.bookmyvenue.backend.dto.authentication.RegisterResponse;
import com.bookmyvenue.backend.entity.Users;
import com.bookmyvenue.backend.enums.UserRole;
import com.bookmyvenue.backend.enums.UserStatus;
import com.bookmyvenue.backend.exception.BadRequestException;
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

    private final JwtService jwtService;

    @Override
    public RegisterResponse register(RegisterRequest registerRequest) {

        if(UserRole.ADMIN.equals(registerRequest.getRole())){
            throw new BadRequestException("Admin Registration is not allowed");
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

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        Users user;

        if(loginRequest.getUserName().contains("@")){
          user = userRepository.findByEmail(loginRequest.getUserName())
                  .orElseThrow(()-> new BadRequestException("Invalid Credentials"));
        }
        else if(loginRequest.getUserName().matches(("^[6-9][0-9]{9}$"))){
             user = userRepository.findByPhone(loginRequest.getUserName())
                    .orElseThrow(()-> new BadRequestException("Invalid Credentials"));
        }
        else{
            throw new BadRequestException("Invalid Credentials");
        }

        if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPasswordHash())){
            throw new BadRequestException("Invalid Credentials ");
        }

        LoginResponse loginResponse = new LoginResponse();

        String token = jwtService.generateToken(user);
        loginResponse.setToken(token);

        loginResponse.setUserId(user.getUserId());
        loginResponse.setFirstName(user.getFirstName());
        loginResponse.setEmail(user.getEmail());
        loginResponse.setPhone(user.getPhone());
        loginResponse.setCity(user.getCity());
        loginResponse.setRole(user.getRole());
        loginResponse.setMessage("Login Successful");

        return loginResponse;
    }

}
