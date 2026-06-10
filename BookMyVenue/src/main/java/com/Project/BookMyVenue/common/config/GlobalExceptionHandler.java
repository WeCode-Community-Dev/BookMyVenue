package com.Project.BookMyVenue.common.config;

import com.Project.BookMyVenue.common.dto.ApiResponse;
import com.Project.BookMyVenue.common.dto.ErrorResponse;
import com.Project.BookMyVenue.common.exception.BadRequestException;
import com.Project.BookMyVenue.common.exception.ResourceNotFoundException;
import com.Project.BookMyVenue.common.exception.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(
            ResourceNotFoundException ex, WebRequest request) {
        log.error("Resource not found: {}", ex.getMessage());
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<?>> handleBadRequest(
            BadRequestException ex, WebRequest request) {
        log.error("Bad request: {}", ex.getMessage());
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorized(
            UnauthorizedException ex, WebRequest request) {
        log.error("Unauthorized: {}", ex.getMessage());
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> validationErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            validationErrors.put(fieldName, errorMessage);
        });
        
        ErrorResponse response = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                "Input validation error",
                request.getDescription(false).replace("uri=", "")
        );
        response.setValidationErrors(validationErrors);
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleNotFound(
            NoHandlerFoundException ex, WebRequest request) {
        log.error("Endpoint not found: {}", ex.getMessage());
        ApiResponse<?> response = ApiResponse.error("Endpoint not found");
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGlobalException(
            Exception ex, WebRequest request) {
        log.error("Internal server error: ", ex);
        ApiResponse<?> response = ApiResponse.error("Internal server error");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}