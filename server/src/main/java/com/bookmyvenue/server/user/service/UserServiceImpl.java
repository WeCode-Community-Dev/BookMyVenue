package com.bookmyvenue.server.user.service;

import com.bookmyvenue.server.auth.service.AuthenticatedUserService;
import com.bookmyvenue.server.user.dto.response.UserProfileResponse;
import com.bookmyvenue.server.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public UserProfileResponse getCurrentUserProfile() {

        User user = authenticatedUserService.getCurrentUser();

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}