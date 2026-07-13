package com.bookmyvenue.server.common.exception;

import com.bookmyvenue.server.common.response.ApiErrorResponse;
import io.jsonwebtoken.JwtException;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

/**
 * Centralized exception handler for the entire application.
 *
 * Converts application exceptions into consistent API error responses,
 * ensuring clients receive meaningful HTTP status codes and messages.
 */
@Hidden
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles business and domain rule violations.
     *
     * Examples:
     * - User already exists
     * - Invalid credentials
     * - Venue not found
     * - Booking slot unavailable
     * - Access denied
     *
     * The HTTP status and error details are determined
     * by the associated {@link ErrorCode}.
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessException(
            BusinessException ex,
            HttpServletRequest request
    ) {

        ErrorCode errorCode = ex.getErrorCode();

        log.warn(
                "Business exception. code={}, message={}, path={}",
                errorCode.getCode(),
                ex.getMessage(),
                request.getRequestURI()
        );

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(errorCode.getStatus().value())
                .code(errorCode.getCode())
                .error(errorCode.getStatus().getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(errorCode.getStatus())
                .body(response);
    }


    /**
     * Handles JWT-related authentication failures.
     *
     * Examples:
     * - Expired token
     * - Invalid token signature
     * - Malformed token
     * - Tampered token
     *
     * Returns HTTP 401 (Unauthorized).
     */
    @ExceptionHandler(JwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiErrorResponse handleJwtException(
            JwtException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                "Invalid or expired token",
                request
        );
    }


    /**
     * Creates a standardized error response object used across the API.
     */
    private ApiErrorResponse buildErrorResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {
        return ApiErrorResponse.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Validation failed");

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .code(ErrorCode.BAD_REQUEST.getCode())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(response);
    }
}