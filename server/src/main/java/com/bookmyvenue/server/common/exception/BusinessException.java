package com.bookmyvenue.server.common.exception;



import lombok.Getter;

/**
 * Base exception for business and domain rule violations.
 *
 * Used when a request cannot be processed because it violates
 * application-specific rules or constraints.
 *
 * Examples:
 * - User already exists
 * - Invalid credentials
 * - Venue not found
 * - Booking slot unavailable
 * - Access denied
 *
 * Each exception is associated with an {@link ErrorCode},
 * which determines the HTTP status, error code,
 * and default error message returned to API clients.
 */
@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(
            ErrorCode errorCode,
            String message
    ) {
        super(message);
        this.errorCode = errorCode;
    }
}
