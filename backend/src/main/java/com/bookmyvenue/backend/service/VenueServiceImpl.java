package com.bookmyvenue.backend.service;


import com.bookmyvenue.backend.dto.Venue.*;
import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoRequest;
import com.bookmyvenue.backend.entity.*;
import com.bookmyvenue.backend.enums.VenueStatus;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.mapper.VenueMapper;
import com.bookmyvenue.backend.repository.AmenityRepository;
import com.bookmyvenue.backend.repository.UserRepository;
import com.bookmyvenue.backend.repository.VenueRepository;
import com.bookmyvenue.backend.specification.VenueSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final VenueMapper venueMapper;
    private final AmenityRepository amenityRepository;
    private final com.bookmyvenue.backend.repository.EventCategoryRepository eventCategoryRepository;

    @Override
    public VenueCreationResponse createVenue(VenueCreationRequest request) {

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
                owner.getFirstName());
        venue.setContactEmail(
                owner.getEmail());
        venue.setCreatedBy(
                request.getCreatedBy());
        venue.setUpdatedBy(
                request.getCreatedBy());

          if (request.getAmenityIds() != null &&
                !request.getAmenityIds().isEmpty()) {

            Set<Amenity> amenities = request.getAmenityIds()
                    .stream()
                    .map(amenityId -> amenityRepository.findById(amenityId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Amenity not found with id : "
                                                    + amenityId)))
                    .collect(Collectors.toSet());

            venue.setAmenities(amenities);
        }

        if (request.getSupportedEventCategoryIds() != null && !request.getSupportedEventCategoryIds().isEmpty()) {
            var categories = request.getSupportedEventCategoryIds().stream()
                    .map(catId -> eventCategoryRepository.findById(catId)
                            .orElseThrow(() -> new ResourceNotFoundException("EventCategory not found with id : " + catId)))
                    .collect(Collectors.toSet());

            venue.setSupportedEventCategories(categories);
        }


        List<VenuePhoto> venuePhotos = new ArrayList<>();

        if (request.getPhotos() != null) {

            for (VenuePhotoRequest photoRequest : request.getPhotos()) {

                VenuePhoto photo = new VenuePhoto();

                photo.setPhotoUrl(photoRequest.getPhotoUrl());
                photo.setIsPrimary(photoRequest.getIsPrimary());
                photo.setDisplayOrder(photoRequest.getDisplayOrder());
                photo.setVenue(venue);

                venuePhotos.add(photo);
            }
        }

        venue.setVenuePhotos(venuePhotos);

        Venue savedVenue =
                venueRepository.save(venue);

        return venueMapper.toResponse(savedVenue);
    }


    @Override
    @Transactional(readOnly = true)
    public VenueCreationResponse getVenueById(Long venueId) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id : "
                                        + venueId));

        return venueMapper.toResponse(venue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VenueCreationResponse> getAllVenues() {

        return venueRepository.findAll()
                .stream()
                .map(venueMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VenueCreationResponse> getVenuesByOwner(Long ownerId) {

        return venueRepository
                .findByOwnerUserUserId(ownerId)
                .stream()
                .map(venueMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VenueCreationResponse> getVenuesByStatus(
            VenueStatus status) {

        return venueRepository
                .findByStatus(status)
                .stream()
                .map(venueMapper::toResponse)
                .toList();
    }



    @Override
    public VenueCreationResponse updateVenue(
            Long venueId,
            VenueCreationRequest request) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id : "
                                        + venueId));

        Users owner = userRepository.findById(
                        request.getOwnerUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Owner not found with id : "
                                        + request.getOwnerUserId()));

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

        venue.setContactName(owner.getFirstName());
        venue.setContactEmail(owner.getEmail());

        venue.setUpdatedBy(request.getCreatedBy());

        // Update Amenities
        if (request.getAmenityIds() != null) {

            Set<Amenity> amenities =
                    request.getAmenityIds()
                            .stream()
                            .map(id -> amenityRepository.findById(id)
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Amenity not found with id : "
                                                            + id)))
                            .collect(Collectors.toSet());

            venue.setAmenities(amenities);
        }

        // Update Event Categories
        if (request.getSupportedEventCategoryIds() != null) {

            Set<EventCategory> categories =
                    request.getSupportedEventCategoryIds()
                            .stream()
                            .map(id -> eventCategoryRepository.findById(id)
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Event Category not found with id : "
                                                            + id)))
                            .collect(Collectors.toSet());

            venue.setSupportedEventCategories(categories);
        }

        // Update Photos
        venue.getVenuePhotos().clear();

        if (request.getPhotos() != null) {

            List<VenuePhoto> photos = new ArrayList<>();

            for (VenuePhotoRequest photoRequest :
                    request.getPhotos()) {

                VenuePhoto photo = new VenuePhoto();

                photo.setVenue(venue);
                photo.setPhotoUrl(
                        photoRequest.getPhotoUrl());
                photo.setIsPrimary(
                        photoRequest.getIsPrimary());
                photo.setDisplayOrder(
                        photoRequest.getDisplayOrder());

                photo.setCreatedBy(
                        request.getCreatedBy());

                photo.setUpdatedBy(
                        request.getCreatedBy());

                photos.add(photo);
            }

            venue.getVenuePhotos().addAll(photos);
        }

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
    public List<VenueCreationResponse> searchVenues(
            VenueSearchRequest request) {
        Specification<Venue> spec = Specification.allOf(
              VenueSpecification.hasSupportedEventType(
                      request.getEventCategoryId()),
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

    @Override
    public VenueCreationResponse updateVenueStatus(
            Long venueId,
            VenueStatusRequest request) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id: " + venueId));

        venue.setStatus(request.getStatus());

        Venue updatedVenue = venueRepository.save(venue);

        return venueMapper.toResponse(updatedVenue);
    }
}