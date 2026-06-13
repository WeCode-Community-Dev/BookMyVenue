package com.Project.BookMyVenue.user.entity;

public enum UserRole {
    ROLE_USER("User"),
    ROLE_VENUE_MANAGER("Venue Manager"),
    ROLE_ADMIN("Administrator");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}