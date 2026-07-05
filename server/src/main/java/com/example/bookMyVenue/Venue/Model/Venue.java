package com.example.bookMyVenue.Venue.Model;

import com.example.bookMyVenue.Enums.AmenityType;
import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueType;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Auth.Model.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bmv_venues")
@Builder
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
    private Double pricePerHour;

    @Enumerated(EnumType.STRING)
    private VenueType venueType;

    private Boolean parkingAvailble;

    private Integer seatingCapacity;

    @ElementCollection(targetClass = AmenityType.class)
    @CollectionTable(
            name = "venue_amenities",
            joinColumns = @JoinColumn(name = "venue_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "amenity")
    private Set<AmenityType> amenities = new HashSet<>();

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL)
    private List<VenueImages> imageFiles;

    @Enumerated(EnumType.STRING)
    private VenueVerificationStatus venueVerificationStatus;

    @Enumerated(EnumType.STRING)
    private VenueActiveStatus venueActiveStatus;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL)
    private List<VenueAvailabilityRules> venueAvailabilityRules;
    private Integer maxAdvanceBookingDays;


    private LocalDateTime createdAt;

}
