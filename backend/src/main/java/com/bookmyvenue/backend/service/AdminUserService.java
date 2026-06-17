package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.admin.AdminUserResponse;

import java.util.List;

public interface AdminUserService {

    List<AdminUserResponse> getAllUsers();

    AdminUserResponse getUserById(
            Long userId);

    List<AdminUserResponse> searchUsers(
            String keyword);

    AdminUserResponse suspendUser(
            Long userId);

    AdminUserResponse activateUser(
            Long userId);
}
