package com.bookmyvenue.server.auth.dto.request;

import com.bookmyvenue.server.user.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User registration request")
public class RegisterRequest {

    @Schema(description = "Full name of the user", example = "Ajay")
    @NotBlank(message = "Name is required")
    private String name;

    @Schema(description = "Unique email address", example = "ajay@gmail.com")
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Schema(description = "10 digit phone number", example = "9876543210")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    @NotBlank(message = "Phone number is required")
    private String phone;

    @Schema(description = "Account password", example = "Password@123")
    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,100}$",
            message = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character")
    private String password;

    @Schema(description = "Account role", example = "USER", allowableValues = {"USER", "VENDOR"})
    @NotNull(message = "Role is required")
    private Role role;
}