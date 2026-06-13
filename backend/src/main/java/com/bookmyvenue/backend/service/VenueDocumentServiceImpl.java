package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venueDocument.VenueDocumentRequest;
import com.bookmyvenue.backend.dto.venueDocument.VenueDocumentResponse;
import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.entity.VenueDocument;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.mapper.VenueDocumentMapper;
import com.bookmyvenue.backend.repository.VenueDocumentRepository;
import com.bookmyvenue.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueDocumentServiceImpl implements VenueDocumentService {

    private final VenueDocumentRepository venueDocumentRepository;
    private final VenueDocumentMapper venueDocumentMapper;
    private final VenueRepository venueRepository;


    @Override
    public VenueDocumentResponse createDocument(
            VenueDocumentRequest request) {

        Venue venue = venueDocumentRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Venue not found with id: " + request.getVenueId())).getVenue();

        VenueDocument venueDocument = VenueDocument.builder()
                .venue(venue)
                .documentType(request.getDocumentType())
                .documentName(request.getDocumentName())
                .documentUrl(request.getDocumentUrl())
                .documentStatus(request.getDocumentStatus())
                .remarks(request.getRemarks())
                .createdBy(1L)
                .updatedBy(1L)
                .build();

        VenueDocument savedDocument =
                venueDocumentRepository.save(venueDocument);

        return venueDocumentMapper.toResponse(savedDocument);
    }

    @Override
    public VenueDocumentResponse getDocumentById(Long id) {

        VenueDocument venueDocument =
                venueDocumentRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Document not found with id: " + id));

        return venueDocumentMapper.toResponse(venueDocument);
    }

    @Override
    public List<VenueDocumentResponse> getAllDocuments() {

        return venueDocumentRepository.findAll()
                .stream()
                .map(venueDocumentMapper::toResponse)
                .toList();
    }

    @Override
    public List<VenueDocumentResponse> getDocumentsByVenue(Long venueId) {

        return venueDocumentRepository
                .findByVenueVenueId(venueId)
                .stream()
                .map(venueDocumentMapper::toResponse)
                .toList();
    }

    @Override
    public VenueDocumentResponse updateDocument(
            Long id,
            VenueDocumentRequest request) {

        VenueDocument existingDocument =
                venueDocumentRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Document not found with id: " + id));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Venue not found with id: " + request.getVenueId()));

        existingDocument.setVenue(venue);
        existingDocument.setDocumentType(request.getDocumentType());
        existingDocument.setDocumentName(request.getDocumentName());
        existingDocument.setDocumentUrl(request.getDocumentUrl());
        existingDocument.setDocumentStatus(request.getDocumentStatus());
        existingDocument.setRemarks(request.getRemarks());
        existingDocument.setUpdatedBy(1L);

        VenueDocument updatedDocument =
                venueDocumentRepository.save(existingDocument);

        return venueDocumentMapper.toResponse(updatedDocument);
    }

    @Override
    public void deleteDocument(Long id) {

        VenueDocument venueDocument =
                venueDocumentRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Document not found with id: " + id));

        venueDocumentRepository.delete(venueDocument);
    }
}