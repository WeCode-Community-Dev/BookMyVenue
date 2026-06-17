package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venuAvailability.VenueAvailabilityRequest;
import com.bookmyvenue.backend.dto.venuAvailability.VenueAvailabilityResponse;
import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.entity.VenueAvailability;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.mapper.VenuAvailabilityMapper;
import com.bookmyvenue.backend.repository.VenueAvailabilityRepository;
import com.bookmyvenue.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueAvailabilityServiceImpl
        implements VenueAvailabilityService {

    private final VenueAvailabilityRepository repository;
    private final VenueRepository venueRepository;
    private final VenueAvailabilityRepository venueAvailabilityRepository;
    private final VenuAvailabilityMapper mapper;

    @Override
    public VenueAvailabilityResponse create(
            VenueAvailabilityRequest request) {

        Venue venue = venueRepository.findById(
                        request.getVenueId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found"));

        VenueAvailability availability =
                VenueAvailability.builder()
                        .venue(venue)
                        .availableDate(request.getAvailableDate())
                        .startTime(request.getStartTime())
                        .endTime(request.getEndTime())
                        .availabilityStatus(
                                request.getAvailabilityStatus())
                        .reason(request.getReason())
                        .createdBy(request.getCreatedBy())
                        .updatedBy(request.getCreatedBy())
                        .build();

        return mapper.toResponse(
                repository.save(availability));
    }

    @Override
    public VenueAvailabilityResponse getById(Long id) {

        return mapper.toResponse(
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Availability not found")));
    }

    @Override
    public List<VenueAvailabilityResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<VenueAvailabilityResponse> getByVenueId(
            Long venueId) {

        return venueAvailabilityRepository.findByVenue_VenueId(venueId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public VenueAvailabilityResponse update(
            Long id,
            VenueAvailabilityRequest request) {

        VenueAvailability availability =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Availability not found"));

        availability.setAvailableDate(
                request.getAvailableDate());
        availability.setStartTime(
                request.getStartTime());
        availability.setEndTime(
                request.getEndTime());
        availability.setAvailabilityStatus(
                request.getAvailabilityStatus());
        availability.setReason(
                request.getReason());

        return mapper.toResponse(
                repository.save(availability));
    }

    @Override
    public void delete(Long id) {

        VenueAvailability availability =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Availability not found"));

        repository.delete(availability);
    }
}