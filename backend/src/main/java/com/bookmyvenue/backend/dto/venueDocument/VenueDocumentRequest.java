package com.bookmyvenue.backend.dto.venueDocument;

import com.bookmyvenue.backend.enums.DocumentStatus;
import com.bookmyvenue.backend.enums.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueDocumentRequest {

    @NotNull
    private Long venueId;

    @NotNull
    private DocumentType documentType;

    @NotBlank
    private String documentName;

    @NotBlank
    private String documentUrl;

    private DocumentStatus documentStatus;

    private String remarks;
}