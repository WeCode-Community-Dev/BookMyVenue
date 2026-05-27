package com.example.bookMyVenue.Model;

import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bmv_venues")
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private String name;
    private String description;
    private String address;
    private String city;

    @Enumerated(EnumType.STRING)
    private VenueVerificationStatus verificationStatus;

    @Enumerated(EnumType.STRING)
    private VenueActiveStatus status;

    private LocalDateTime createdAt;
}
