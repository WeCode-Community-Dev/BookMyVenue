package com.bookmyvenue.server.user.controller;

import com.bookmyvenue.server.user.dto.response.UserProfileResponse;
import com.bookmyvenue.server.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get user profile", description = "Returns the profile details of the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Profile retrieved successfully")
    @GetMapping("/profile")
    public UserProfileResponse getProfile() {
        return userService.getCurrentUserProfile();
    }
}