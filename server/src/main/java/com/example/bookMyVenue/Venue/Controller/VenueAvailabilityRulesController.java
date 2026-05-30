package com.example.bookMyVenue.Venue.Controller;

import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityRulesRequest;
import com.example.bookMyVenue.Venue.Service.VenueAvailabilityRulesService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping()
@AllArgsConstructor
public class VenueAvailabilityRulesController {

    private final VenueAvailabilityRulesService venueAvailabilityRulesService;

    public ResponseEntity<?> createVenueAvailabilityRules(@Valid @RequestBody VenueAvailabilityRulesRequest venueAvailabilityRulesRequest){
//        write business logic if any later
        venueAvailabilityRulesService.createAvailabilityRules(venueAvailabilityRulesRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
