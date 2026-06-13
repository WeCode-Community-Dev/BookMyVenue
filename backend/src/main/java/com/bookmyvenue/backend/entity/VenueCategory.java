package com.bookmyvenue.backend.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "venueCategory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name",nullable = false,length = 255)
    private String categoryName;

    @Column(name = "description",columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active",nullable = false)
    private Boolean isActive=false;


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
