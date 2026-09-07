package com.example.bookMyVenue.Venue.DTO;

import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class ActionRequest {
    @NotBlank(message = "Reason is required")
    private String reason;

}
