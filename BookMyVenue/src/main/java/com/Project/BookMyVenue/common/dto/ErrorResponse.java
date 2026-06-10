package com.Project.BookMyVenue.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    
    private int status;
    private String message;
    private String error;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> validationErrors;
    
    public ErrorResponse(int status, String message, String error, String path) {
        this.status = status;
        this.message = message;
        this.error = error;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
}