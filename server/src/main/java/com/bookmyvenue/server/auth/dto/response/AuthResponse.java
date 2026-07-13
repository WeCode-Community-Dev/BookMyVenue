package com.bookmyvenue.server.auth.dto.response;

import com.bookmyvenue.server.user.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Authentication response returned after successful login or registration")
public class AuthResponse {

    @Schema(description = "Unique identifier of the authenticated user", example = "82b45eec-c37b-4ef5-b5fb-921ab399cb13")
    private UUID userId;

    @Schema(description = "Full name of the user", example = "Ajay")
    private String name;

    @Schema(description = "Registered email address", example = "ajay@gmail.com")
    private String email;

    @Schema(description = "Role assigned to the user", example = "USER")
    private Role role;

}