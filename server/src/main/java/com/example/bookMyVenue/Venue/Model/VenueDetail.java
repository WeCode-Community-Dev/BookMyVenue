package com.example.bookMyVenue.Venue.Model;

import com.example.bookMyVenue.Enums.AmenityType;
import com.example.bookMyVenue.Enums.VenueType;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class VenueDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id;

    @OneToOne
    @JoinColumn(name="venue_id")
    private Venue venue;



}
