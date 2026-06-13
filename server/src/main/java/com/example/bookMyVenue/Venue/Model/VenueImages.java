package com.example.bookMyVenue.Venue.Model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bmv_venue_images")
@Builder
public class VenueImages {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name="venue_id")
    private Venue venue;

    private String fileLocation;
}
