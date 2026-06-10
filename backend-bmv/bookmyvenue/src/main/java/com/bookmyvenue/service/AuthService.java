package com.bookmyvenue.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bookmyvenue.dto.AuthResponse;
import com.bookmyvenue.dto.LoginRequest;
import com.bookmyvenue.dto.RegisterRequest;
import com.bookmyvenue.exception.UserAlreadyExistsException;
import com.bookmyvenue.model.User;
import com.bookmyvenue.repository.UserRepository;
import com.bookmyvenue.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;//The issue is only that Spring cannot find a PasswordEncoder bean for this line:But it does NOT know how to create:PasswordEncoderSo you must manually register it as a Bean.
    private final JwtUtil jwtUtil;


    public AuthResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new UserAlreadyExistsException("Email alredy exists");
        }

        User user = User.builder()
                        .name(request.getName())//user.setname(request.getName());
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .role(request.getRole() != null ? request.getRole() : User.Role.user)
                        .location(request.getLocation())
                        .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole().name());

    }

    public AuthResponse login(LoginRequest request){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole().name());
    }
}
