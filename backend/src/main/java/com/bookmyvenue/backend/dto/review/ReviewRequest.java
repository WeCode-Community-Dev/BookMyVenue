package com.bookmyvenue.backend.dto.review;

import lombok.Data;

@Data
public class ReviewRequest {

    private Long venueId;

    private Integer rating;

    private String comment;
}