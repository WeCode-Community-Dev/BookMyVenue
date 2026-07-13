package com.bookmyvenue.server.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User login request")
public class LoginRequest {

    @Schema(
            description = "Registered email address",
            example = "ajay@gmail.com"
    )
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Schema(
            description = "Account password",
            example = "password123"
    )
    @NotBlank(message = "Password is required")
    private String password;
}