package com.example.bookMyVenue.Venue.Controller;

import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Repository.VenueRepo;
import com.example.bookMyVenue.Venue.Service.VenueService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/venue")
@AllArgsConstructor
public class VenueController {

    public final VenueService venueService;

    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(venueService.getAllActiveVenues());

    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@RequestParam Long id) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(venueService.getVenueById(id));
    }
}