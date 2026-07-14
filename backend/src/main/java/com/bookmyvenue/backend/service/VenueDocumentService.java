package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.venueDocument.*;

import java.util.List;

public interface VenueDocumentService {

    VenueDocumentResponse createDocument(
            VenueDocumentRequest request);

    VenueDocumentResponse getDocumentById(Long id);

    List<VenueDocumentResponse> getAllDocuments();

    List<VenueDocumentResponse> getDocumentsByVenue(Long venueId);

    VenueDocumentResponse updateDocument(
            Long id,
            VenueDocumentRequest request);

    void deleteDocument(Long id);
}