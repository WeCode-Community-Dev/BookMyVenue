package com.bookmyvenue.backend.dto.authentication;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Registered Email/Phone Number is required")
    private String userName;
    @NotBlank(message = "Password is required")
    private String password;
}
