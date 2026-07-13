package com.bookmyvenue.server.common.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Standard API error response.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Standard API error response")
public class ApiErrorResponse {

    @Schema(description = "HTTP status code", example = "401")
    private int status;

    @Schema(description = "Application error code", example = "RESOURCE_NOT_FOUND")
    private String code;

    @Schema(description = "Error type", example = "Unauthorized")
    private String error;

    @Schema(description = "Detailed error message", example = "Invalid credentials")
    private String message;

    @Schema(description = "Request path that triggered the error", example = "/api/resource")
    private String path;

    @Schema(description = "Timestamp of the error", example = "2026-06-04T01:22:49")
    private LocalDateTime timestamp;
}