package com.bookmyvenue.backend.controller;

import com.bookmyvenue.backend.dto.admin.AdminUserResponse;
import com.bookmyvenue.backend.service.AdminUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin User Management")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>>
    getAllUsers() {

        return ResponseEntity.ok(
                adminUserService.getAllUsers());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserResponse>
    getUserById(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                adminUserService
                        .getUserById(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AdminUserResponse>>
    searchUsers(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                adminUserService
                        .searchUsers(keyword));
    }

    @PatchMapping("/{userId}/suspend")
    public ResponseEntity<AdminUserResponse>
    suspendUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                adminUserService
                        .suspendUser(userId));
    }

    @PatchMapping("/{userId}/activate")
    public ResponseEntity<AdminUserResponse>
    activateUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                adminUserService
                        .activateUser(userId));
    }
}