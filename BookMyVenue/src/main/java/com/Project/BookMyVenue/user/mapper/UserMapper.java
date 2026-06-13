package com.Project.BookMyVenue.user.mapper;

import com.Project.BookMyVenue.user.dto.UserResponse;
import com.Project.BookMyVenue.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setUsername(user.getUsername());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole().name());
        response.setIsActive(user.getIsActive());
        response.setIsEmailVerified(user.getIsEmailVerified());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        
        return response;
    }
}