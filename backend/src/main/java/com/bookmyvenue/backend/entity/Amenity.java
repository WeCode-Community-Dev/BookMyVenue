package com.bookmyvenue.backend.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "amenity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "amenity_id")
    private Long amenityId;

    @Column(name = "amenity_name",nullable = false,unique = true, length = 255)
    private String amenityName;

    @Column(name = "description",columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active",nullable = false)
    private Boolean isActive=true;

    @ManyToMany(mappedBy = "amenities")
    private Set<Venue> venues;

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
        if(this.isActive==null)
        {
            this.isActive=true;
        }

    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = LocalDateTime.now();
    }


}
