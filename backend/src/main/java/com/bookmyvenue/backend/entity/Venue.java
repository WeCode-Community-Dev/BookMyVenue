package com.bookmyvenue.backend.entity;
import com.bookmyvenue.backend.enums.PricingType;
import com.bookmyvenue.backend.enums.VenueStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "venue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "venue_id")
    private Long venueId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private Users ownerUser;

    @Column(name = "venue_name",nullable = false,length = 255)
    private String venueName;


    @Column(name = "address_line1",nullable = false,length = 255)
    private String addressLine1;

    @Column(name = "address_line2",length = 255)
    private String addressLine2;

    @Column(name = "city",nullable = false,length = 100)
    private String city;

    @Column(name = "district",nullable = false,length = 255)
    private String district;

    @Column(name = "state",nullable = false,length = 100)
    private String state;

    @Column(name = "country",nullable = false,length = 100)
    private String country;

    @Column(name = "pincode",length =20)
    private String pincode;

    @Column(name = "latitude",precision=11,scale=8)
    private BigDecimal latitude;

    @Column(name = "longitude",precision=11,scale=8)
    private BigDecimal longitude;

    @Column(name = "capacity",nullable = false)
    private Integer capacity;


    @Enumerated(EnumType.STRING)
    @Column(name = "pricing_type", nullable = false)
    private PricingType pricingType;

    @Column(name = "base_price",nullable=false,precision=12,scale=2)
    private BigDecimal basePrice;

    @Column(name = "advance_percentage",precision=12,scale=2)
    private BigDecimal advancePercentage;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VenueStatus status = VenueStatus.PENDING_APPROVAL;

    @Column(name = "approval_remarks",columnDefinition = "TEXT")
    private String approvalRemarks;

    @Column(name = "contact_name",length = 150)
    private String contactName;

    @Column(name = "contact_email",length = 150)
    private String contactEmail;

    @ManyToMany
    @JoinTable(
            name="venue_amenity",
            joinColumns =@JoinColumn(name="venue_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")

    )
private Set<Amenity> amenities;

    @ManyToMany
    @JoinTable(
            name="venue_category_map",
            joinColumns =@JoinColumn(name="venue_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")

    )
    private Set<VenueCategory> venuCategories;

    @OneToMany(mappedBy="venue",
            cascade=CascadeType.ALL,
            orphanRemoval = true)
    private List<VenuePhoto> venuePhotos;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", nullable = false, updatable = false)
    private Long createdBy;

    @Column(name = "updated_by",nullable = false)
    private Long updatedBy;

    @PrePersist
    protected void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if(this.status==null)
        {
            this.status=VenueStatus.PENDING_APPROVAL;
        }
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = LocalDateTime.now();
    }


}
