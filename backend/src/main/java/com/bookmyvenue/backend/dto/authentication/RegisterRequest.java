package com.bookmyvenue.backend.dto.authentication;

import com.bookmyvenue.backend.enums.UserRole;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank (message = "First name is required")
    private String firstName;

    private String lastName;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[6-9][0-9]{9}$",
            message = "Phone Number must be a valid 10 digit Indian Mobile Number"
    )
    private String phone;

    @NotBlank (message = "Password is required")
    @Size(min = 8, max = 30, message = "Password must be between 8 and 30 characters")
    private String password;

    @NotBlank(message = "Email ID is required")
    @Email(message = "Invalid Email format")
    private String email;

    @NotNull(message = "Role is required")
    private UserRole role;
}
