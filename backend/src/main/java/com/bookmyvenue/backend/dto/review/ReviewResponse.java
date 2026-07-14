package com.bookmyvenue.backend.dto.review;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {

    private Long reviewId;

    private Long venueId;

    private String venueName;

    private Long userId;

    private String userName;

    private Integer rating;

    private String comment;

    private LocalDateTime reviewDate;
}
