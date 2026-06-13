package com.Project.BookMyVenue.common.config;

import com.Project.BookMyVenue.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {
    
    @GetMapping
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        ApiResponse<String> response = ApiResponse.success(
            "Application is running", 
            "BookMyVenue API is healthy"
        );
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<String>> getStatus() {
        ApiResponse<String> response = ApiResponse.success(
            "Status check", 
            "Phase 1: Foundation Setup - Complete"
        );
        return ResponseEntity.ok(response);
    }
}