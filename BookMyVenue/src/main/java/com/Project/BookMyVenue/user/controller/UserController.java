    package com.Project.BookMyVenue.user.controller;

    import com.Project.BookMyVenue.common.dto.ApiResponse;
    import com.Project.BookMyVenue.user.dto.UserLoginRequest;
    import com.Project.BookMyVenue.user.dto.UserLoginResponse;
    import com.Project.BookMyVenue.user.dto.UserRegisterRequest;
    import com.Project.BookMyVenue.user.dto.UserResponse;
    import com.Project.BookMyVenue.user.security.JwtTokenProvider;
    import com.Project.BookMyVenue.user.service.UserService;
    import jakarta.validation.Valid;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/api/auth")
    @Slf4j
    public class UserController {
        
        private final UserService userService;
        private final JwtTokenProvider jwtTokenProvider;
        
        public UserController(UserService userService, JwtTokenProvider jwtTokenProvider) {
            this.userService = userService;
            this.jwtTokenProvider = jwtTokenProvider;
        }
        
        /**
         * Register a new user
         */
        @PostMapping("/register")
        public ResponseEntity<ApiResponse<UserResponse>> registerUser(
                @Valid @RequestBody UserRegisterRequest request) {
            log.info("Received registration request for email: {}", request.getEmail());
            UserResponse response = userService.registerUser(request);
            ApiResponse<UserResponse> apiResponse = ApiResponse.success(
                "User registered successfully",
                response
            );
            return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
        }
        
        /**
         * Login user and get JWT token
         */
        @PostMapping("/login")
        public ResponseEntity<ApiResponse<UserLoginResponse>> loginUser(
                @Valid @RequestBody UserLoginRequest request) {
            log.info("Received login request for email: {}", request.getEmail());
            UserLoginResponse response = userService.loginUser(request);
            ApiResponse<UserLoginResponse> apiResponse = ApiResponse.success(
                "Login successful",
                response
            );
            return ResponseEntity.ok(apiResponse);
        }
        
        /**
         * Get current authenticated user profile
         */
        @GetMapping("/profile")
        public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(
                @RequestHeader("Authorization") String token) {
            // Extract token without "Bearer " prefix
            String jwtToken = token.substring(7);
            String email = jwtTokenProvider.getEmailFromToken(jwtToken);
            
            log.info("Fetching user profile for email: {}", email);
            UserResponse response = userService.getUserByEmail(email);
            ApiResponse<UserResponse> apiResponse = ApiResponse.success(
                "User profile retrieved successfully",
                response
            );
            return ResponseEntity.ok(apiResponse);
        }
    }