package com.bookmyvenue.server.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Defines all application-specific error codes.
 *
 * Each error code contains:
 * - HTTP status to return
 * - Unique error code for clients
 * - Default error message
 */
@Getter
public enum ErrorCode {

    USER_ALREADY_EXISTS(
            HttpStatus.CONFLICT,
            "USER_ALREADY_EXISTS",
            "User already exists"
    ),
    PHONE_ALREADY_EXISTS(
            HttpStatus.CONFLICT,
            "PHONE_ALREADY_EXISTS",
            "phone number already registered"
    ),
    ADMIN_REGISTRATION_NOT_ALLOWED(
            HttpStatus.BAD_REQUEST,
            "ADMIN_REGISTRATION_NOT_ALLOWED",
            "admin registration not allowed"
    ),

    INVALID_CREDENTIALS(
            HttpStatus.UNAUTHORIZED,
            "INVALID_CREDENTIALS",
            "Invalid credentials"
    ),

    VENUE_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "VENUE_NOT_FOUND",
            "Venue not found"
    ),

    VENUE_CATEGORY_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "VENUE_CATEGORY_NOT_FOUND",
            "Venue category not found"
    ),

    BOOKING_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "BOOKING_NOT_FOUND",
            "Booking not found"
    ),

    ACCESS_DENIED(
            HttpStatus.FORBIDDEN,
            "ACCESS_DENIED",
            "Access denied"
    ),

    BAD_REQUEST(
            HttpStatus.BAD_REQUEST,
            "BAD_REQUEST",
            "Invalid request"
    ),
    USER_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "USER NOT FOUND",
            "user not found"
    ),

    INVALID_REFRESH_TOKEN(
            HttpStatus.UNAUTHORIZED,
            "INVALID_REFRESH_TOKEN",
            "Invalid or expired token"
    ),
    INVALID_TIME_RANGE(HttpStatus.BAD_REQUEST,
            " INVALID_TIME_RANGE",
            "End time must be after start time"),

    SLOT_TEMPLATE_NOT_FOUND(HttpStatus.NOT_FOUND,
            " SLOT_TEMPLATE_NOT_FOUND",
            "Slot template not found"),

    OVERLAPPING_SLOT_TEMPLATE(HttpStatus.BAD_REQUEST,
            "OVERLAPPING_SLOT_TEMPLATE",
            "Slot template overlaps with existing schedule"),
    SLOT_ALREADY_BOOKED(
            HttpStatus.CONFLICT,
            "SLOT_ALREADY_BOOKED",
            "Selected slot is already booked"
    ),
    INVALID_BOOKING_DATE(
            HttpStatus.BAD_REQUEST,
            "INVALID_BOOKING_DATE",
            "Selected date does not match the slot template schedule"
    ),
    INVALID_BOOKING_STATUS(
            HttpStatus.BAD_REQUEST,
            "INVALID_BOOKING_STATUS",
            "Booking is not eligible for payment"
    ),
    PAYMENT_ALREADY_EXISTS(
            HttpStatus.CONFLICT,
            "PAYMENT_ALREADY_EXISTS",
            "Payment already exists for this booking"
    ),
    PAYMENT_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "PAYMENT_NOT_FOUND",
            "Payment not found"
    ),
    INVALID_PAYMENT_SIGNATURE(
            HttpStatus.BAD_REQUEST,
            "INVALID_PAYMENT_SIGNATURE",
            "Invalid payment signature"
    ),
    INVALID_OTP(
            HttpStatus.BAD_REQUEST,
            "INVALID_OTP",
            "Invalid OTP."
    ),

    OTP_EXPIRED(
            HttpStatus.BAD_REQUEST,
            "OTP_EXPIRED",
            "OTP has expired. Please request a new one."
    ),

    EMAIL_ALREADY_VERIFIED(
            HttpStatus.BAD_REQUEST,
            "EMAIL_ALREADY_VERIFIED",
            "Email is already verified."
    ),
    EMAIL_NOT_VERIFIED(
            HttpStatus.FORBIDDEN,
            "EMAIL_NOT_VERIFIED",
            "Email is not verified."
    ),
    VENUE_CAPACITY_EXCEEDED(
            HttpStatus.BAD_REQUEST,
            "VENUE_CAPACITY_EXCEEDED",
            "Requested guest count exceeds venue capacity."
    ),
    INVALID_VENUE_STATUS(
            HttpStatus.BAD_REQUEST,
            "INVALID_VENUE_STATUS",
            "Invalid venue status"
    );


    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(
            HttpStatus status,
            String code,
            String message
    ) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
