package com.Project.BookMyVenue.user.service;

import com.Project.BookMyVenue.common.exception.BadRequestException;
import com.Project.BookMyVenue.common.exception.ResourceNotFoundException;
import com.Project.BookMyVenue.user.dto.UserLoginRequest;
import com.Project.BookMyVenue.user.dto.UserLoginResponse;
import com.Project.BookMyVenue.user.dto.UserRegisterRequest;
import com.Project.BookMyVenue.user.dto.UserResponse;
import com.Project.BookMyVenue.user.entity.User;
import com.Project.BookMyVenue.user.entity.UserRole;
import com.Project.BookMyVenue.user.mapper.UserMapper;
import com.Project.BookMyVenue.user.repository.UserRepository;
import com.Project.BookMyVenue.user.security.JwtTokenProvider;
import com.Project.BookMyVenue.common.constants.AppConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                      JwtTokenProvider jwtTokenProvider, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userMapper = userMapper;
    }
    
    /**
     * Register a new user
     */
    public UserResponse registerUser(UserRegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        
        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(UserRole.ROLE_USER);
        user.setIsActive(true);
        user.setIsEmailVerified(false);
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with id: {}", savedUser.getId());
        
        return userMapper.toUserResponse(savedUser);
    }
    
    /**
     * Login user and return JWT token
     */
    public UserLoginResponse loginUser(UserLoginRequest request) {
        log.info("Attempting to login user with email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }
        
        // Check if user is active
        if (!user.getIsActive()) {
            throw new BadRequestException("User account is deactivated");
        }
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        
        log.info("User logged in successfully with email: {}", request.getEmail());
        
        UserLoginResponse response = new UserLoginResponse();
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRole(user.getRole().name());
        response.setAccessToken(token);
        response.setTokenType("Bearer");
        response.setExpiresIn(AppConstants.JWT_EXPIRATION);
        
        return response;
    }
    
    /**
     * Get user by email
     */
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return userMapper.toUserResponse(user);
    }
    
    /**
     * Get user by ID
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return userMapper.toUserResponse(user);
    }
}