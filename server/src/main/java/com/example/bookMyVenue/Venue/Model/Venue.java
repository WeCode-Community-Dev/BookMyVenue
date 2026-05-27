package com.example.bookMyVenue.Venue.Model;

import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Auth.Model.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;


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

    @Enumerated(EnumType.STRING)
    private VenueVerificationStatus verificationStatus;

    @Enumerated(EnumType.STRING)
    private VenueActiveStatus status;

    private LocalDateTime createdAt;

    private List<MultipartFile> imageFiles;
}
