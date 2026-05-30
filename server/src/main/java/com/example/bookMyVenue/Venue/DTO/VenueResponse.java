package com.example.bookMyVenue.Venue.DTO;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueResponse {
    private String VenueName;
    private String status;

}
