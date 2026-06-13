package com.Project.BookMyVenue.common.constants;

public class AppConstants {
    
    public static final String JWT_SECRET = "BookMyVenue_SECRET_KEY_256_BIT_LENGTH_MINIMUM_REQUIRED_FOR_SECURITY";
    public static final long JWT_EXPIRATION = 86400000; // 24 hours in milliseconds
    public static final String JWT_HEADER = "Authorization";
    public static final String JWT_PREFIX = "Bearer ";
    
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_VENUE_MANAGER = "ROLE_VENUE_MANAGER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    
    public static final int PAGE_SIZE_DEFAULT = 10;
    public static final int PAGE_NUMBER_DEFAULT = 0;
    
    public static final String SUCCESS = "SUCCESS";
    public static final String ERROR = "ERROR";
    public static final String PENDING = "PENDING";
    public static final String CONFIRMED = "CONFIRMED";
    public static final String CANCELLED = "CANCELLED";
}