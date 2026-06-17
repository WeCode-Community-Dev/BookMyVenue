package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.admin.AdminUserResponse;
import com.bookmyvenue.backend.entity.Users;
import com.bookmyvenue.backend.enums.UserStatus;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.repository.BookingRepository;
import com.bookmyvenue.backend.repository.UserRepository;
import com.bookmyvenue.backend.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl
        implements AdminUserService {

    private final UserRepository userRepository;

    private final BookingRepository bookingRepository;

    @Override
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AdminUserResponse getUserById(
            Long userId) {

        Users user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        return mapToResponse(user);
    }

    @Override
    public List<AdminUserResponse> searchUsers(
            String keyword) {

        Specification<Users> spec =
                Specification.allOf(
                        UserSpecification
                                .hasKeyword(keyword));

        return userRepository.findAll(spec)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AdminUserResponse suspendUser(
            Long userId) {

        Users user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        user.setStatus(
                UserStatus.SUSPENDED);

        return mapToResponse(
                userRepository.save(user));
    }

    @Override
    public AdminUserResponse activateUser(
            Long userId) {

        Users user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found"));

        user.setStatus(
                UserStatus.ACTIVE);

        return mapToResponse(
                userRepository.save(user));
    }

    private AdminUserResponse mapToResponse(
            Users user) {

        long bookingCount =
                bookingRepository
                        .countByUserUserId(
                                user.getUserId());

        return AdminUserResponse.builder()
                .userId(user.getUserId())
                .fullName(user.getFirstName())
                .email(user.getEmail())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .totalBookings(bookingCount)
                .build();
    }
}
