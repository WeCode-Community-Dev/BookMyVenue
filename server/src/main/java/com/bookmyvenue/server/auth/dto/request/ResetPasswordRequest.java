package com.bookmyvenue.server.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Reset password request")
public class ResetPasswordRequest {

    @Schema(description = "Registered email address", example = "ajay@gmail.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Schema(description = "OTP sent to the registered email", example = "123456")
    @NotBlank(message = "OTP is required")
    private String otp;

    @Schema(description = "New account password", example = "Password@123")
    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,100}$",
            message = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    )
    private String newPassword;
}