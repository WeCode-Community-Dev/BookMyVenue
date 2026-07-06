package com.bookmyvenue.backend.dto.authentication;

import com.bookmyvenue.backend.enums.UserRole;
import lombok.Data;

@Data
public class LoginResponse {

    private long userId;
    private String firstName;
    private String email;
    private String phone;
    private String city;
    private UserRole role;
    private String message;
    private String token;
}
