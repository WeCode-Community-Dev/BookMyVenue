package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoRequest;
import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoResponse;
import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.entity.VenuePhoto;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.mapper.VenuePhotoMapper;
import com.bookmyvenue.backend.repository.VenuePhotoRepository;
import com.bookmyvenue.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenuePhotoServiceImpl implements VenuePhotoService {

    private final VenuePhotoRepository venuePhotoRepository;
    private final VenueRepository venueRepository;
    private final VenuePhotoMapper mapper;

    @Override
    public VenuePhotoResponse create(VenuePhotoRequest request) {

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id: "
                                        + request.getVenueId()));

        VenuePhoto venuePhoto = VenuePhoto.builder()
                .venue(venue)
                .isPrimary(request.getIsPrimary())
                .displayOrder(request.getDisplayOrder())
                .createdBy(request.getCreatedBy())
                .updatedBy(request.getUpdatedBy())
                .build();

        return mapper.toResponse(
                venuePhotoRepository.save(venuePhoto)
        );
    }

    @Override
    public VenuePhotoResponse getById(Long photoId) {

        VenuePhoto photo = venuePhotoRepository.findById(photoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "VenuePhoto not found with id: "
                                        + photoId));

        return mapper.toResponse(photo);
    }


    @Override
    public List<VenuePhotoResponse> getAllPhotoByVenueId(Long venueId) {

        // Optional validation to ensure venue exists
        venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id: " + venueId));

        return venuePhotoRepository.findByVenue_VenueId(venueId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
    @Override
    public VenuePhotoResponse update(Long photoId,
                                        VenuePhotoRequest request) {

        VenuePhoto photo = venuePhotoRepository.findById(photoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "VenuePhoto not found with id: "
                                        + photoId));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id: "
                                        + request.getVenueId()));

        photo.setVenue(venue);
        photo.setIsPrimary(request.getIsPrimary());
        photo.setDisplayOrder(request.getDisplayOrder());
        photo.setUpdatedBy(request.getUpdatedBy());

        return mapper.toResponse(
                venuePhotoRepository.save(photo)
        );
    }

    @Override
    public void delete(Long photoId) {

        VenuePhoto photo = venuePhotoRepository.findById(photoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "VenuePhoto not found with id: "
                                        + photoId));

        venuePhotoRepository.delete(photo);
    }
}