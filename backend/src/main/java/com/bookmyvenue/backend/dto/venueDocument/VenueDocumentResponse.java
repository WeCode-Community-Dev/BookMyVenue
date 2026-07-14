package com.bookmyvenue.backend.dto.venueDocument;

import com.bookmyvenue.backend.enums.DocumentStatus;
import com.bookmyvenue.backend.enums.DocumentType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueDocumentResponse {

    private Long documentId;

    private Long venueId;

    private String venueName;

    private DocumentType documentType;

    private String documentName;

    private String documentUrl;

    private DocumentStatus documentStatus;

    private String remarks;

    private Long createdBy;

    private Long updatedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}