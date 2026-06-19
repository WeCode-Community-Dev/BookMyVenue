package com.bookmyvenue.backend.service;


import com.bookmyvenue.backend.dto.Venue.VenueRequest;
import com.bookmyvenue.backend.dto.Venue.VenueResponse;
import com.bookmyvenue.backend.dto.Venue.VenueSearchRequest;
import com.bookmyvenue.backend.entity.Users;
import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.enums.VenueStatus;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.mapper.VenueMapper;
import com.bookmyvenue.backend.repository.UserRepository;
import com.bookmyvenue.backend.repository.VenueRepository;
import com.bookmyvenue.backend.specification.VenueSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final VenueMapper venueMapper;

    @Override
    public VenueResponse createVenue(VenueRequest request) {

        Users owner = userRepository.findById(request.getOwnerUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner not found with id : "
                                        + request.getOwnerUserId()));

        Venue venue = new Venue();

        venue.setOwnerUser(owner);
        venue.setVenueName(request.getVenueName());
        venue.setAddressLine1(request.getAddressLine1());
        venue.setAddressLine2(request.getAddressLine2());
        venue.setCity(request.getCity());
        venue.setDistrict(request.getDistrict());
        venue.setState(request.getState());
        venue.setCountry(request.getCountry());
        venue.setPincode(request.getPincode());
        venue.setLatitude(request.getLatitude());
        venue.setLongitude(request.getLongitude());
        venue.setCapacity(request.getCapacity());
        venue.setPricingType(request.getPricingType());
        venue.setBasePrice(request.getBasePrice());
        venue.setAdvancePercentage(
                request.getAdvancePercentage());
        venue.setContactName(
                request.getContactName());
        venue.setContactEmail(
                request.getContactEmail());
        venue.setCreatedBy(
                request.getCreatedBy());
        venue.setUpdatedBy(
                request.getCreatedBy());

        Venue savedVenue =
                venueRepository.save(venue);

        return venueMapper.toResponse(savedVenue);
    }

    @Override
    @Transactional(readOnly = true)
    public VenueResponse getVenueById(Long venueId) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id : "
                                        + venueId));

        return venueMapper.toResponse(venue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VenueResponse> getAllVenues() {

        return venueRepository.findAll()
                .stream()
                .map(venueMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VenueResponse> getVenuesByOwner(Long ownerId) {

        return venueRepository
                .findByOwnerUserUserId(ownerId)
                .stream()
                .map(venueMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VenueResponse> getVenuesByStatus(
            VenueStatus status) {

        return venueRepository
                .findByStatus(status)
                .stream()
                .map(venueMapper::toResponse)
                .toList();
    }

    @Override
    public VenueResponse updateVenue(
            Long venueId,
            VenueRequest request) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id : "
                                        + venueId));

        venue.setVenueName(request.getVenueName());
        venue.setAddressLine1(request.getAddressLine1());
        venue.setAddressLine2(request.getAddressLine2());
        venue.setCity(request.getCity());
        venue.setDistrict(request.getDistrict());
        venue.setState(request.getState());
        venue.setCountry(request.getCountry());
        venue.setPincode(request.getPincode());
        venue.setLatitude(request.getLatitude());
        venue.setLongitude(request.getLongitude());
        venue.setCapacity(request.getCapacity());
        venue.setPricingType(request.getPricingType());
        venue.setBasePrice(request.getBasePrice());
        venue.setAdvancePercentage(
                request.getAdvancePercentage());
        venue.setContactName(
                request.getContactName());
        venue.setContactEmail(
                request.getContactEmail());
        venue.setUpdatedBy(
                request.getCreatedBy());

        Venue updatedVenue =
                venueRepository.save(venue);

        return venueMapper.toResponse(updatedVenue);
    }

    @Override
    public void deleteVenue(Long venueId) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id : "
                                        + venueId));

        venueRepository.delete(venue);
    }

    @Override
    public List<VenueResponse> searchVenues(
            VenueSearchRequest request) {
        Specification<Venue> spec = Specification.allOf(
                VenueSpecification.hasCategory(
                        request.getCategoryId()),
                VenueSpecification.hasMinPrice(
                        request.getMinPrice()),
                VenueSpecification.hasMaxPrice(
                        request.getMaxPrice()),
                VenueSpecification.hasCapacity(
                        request.getCapacity()),
                VenueSpecification.hasCity(
                        request.getCity()),
                VenueSpecification.isAvailableOn(
                        request.getAvailableDate())
        );
        return venueRepository.findAll(spec)
                .stream()
                .map(venueMapper::toResponse)
                .toList();
    }
}