package com.bookmyvenue.server.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Refresh token request")
public class RefreshTokenRequest {

    @Schema(
            description = "JWT refresh token",
            example = "eyJhbGciOiJIUzM4NCJ9..."
    )
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}