package com.bookmyvenue.server.admin.service;

import com.bookmyvenue.server.admin.dto.response.AdminUserResponse;
import com.bookmyvenue.server.admin.dto.response.AdminVenueResponse;
import com.bookmyvenue.server.admin.dto.response.DashboardResponse;
import com.bookmyvenue.server.booking.repository.BookingRepository;
import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.user.enums.Role;
import com.bookmyvenue.server.user.repository.UserRepository;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.entity.VenueStatus;
import com.bookmyvenue.server.venue.mapper.VenueMapper;
import com.bookmyvenue.server.venue.repository.VenueRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final BookingRepository bookingRepository;
    private final VenueMapper venueMapper;


    @Override
    public DashboardResponse getDashboard() {
        return DashboardResponse.builder()
                .totalUsers(userRepository.countByRole(Role.USER))
                .totalVendors(userRepository.countByRole(Role.VENDOR))
                .totalVenues(venueRepository.count())
                .pendingVenues(
                        venueRepository.countByStatus(
                                VenueStatus.PENDING_APPROVAL))
                .approvedVenues(
                        venueRepository.countByStatus(
                                VenueStatus.APPROVED))
                .rejectedVenues(
                        venueRepository.countByStatus(
                                VenueStatus.REJECTED))
                .totalBookings(bookingRepository.count())
                .build();
    }




    @Override
    public Page<AdminVenueResponse> getPendingVenues(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        return venueRepository
                .findByStatus(
                        VenueStatus.PENDING_APPROVAL,
                        pageable
                )
                .map(venue -> AdminVenueResponse.builder()
                        .id(venue.getId())
                        .name(venue.getName())
                        .district(venue.getDistrict())
                        .address(venue.getAddress())
                        .capacity(venue.getCapacity())
                        .ownerName(venue.getOwner().getName())
                        .ownerEmail(venue.getOwner().getEmail())
                        .status(venue.getStatus())
                        .build());
    }


    @Override
    @Transactional
    public void approveVenue(Long venueId) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));
        if (venue.getStatus() != VenueStatus.PENDING_APPROVAL) {
            throw new BusinessException(ErrorCode.INVALID_VENUE_STATUS);
        }
        venue.setStatus(VenueStatus.APPROVED);
        venueRepository.save(venue);
    }


    @Override
    @Transactional
    public void rejectVenue(Long venueId) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));
        if (venue.getStatus() != VenueStatus.PENDING_APPROVAL) {
            throw new BusinessException(ErrorCode.INVALID_VENUE_STATUS);
        }
        venue.setStatus(VenueStatus.REJECTED);
        venueRepository.save(venue);
    }


    @Override
    public VenueResponse getVenue(Long venueId) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));
        return venueMapper.toResponse(venue);
    }


    @Override
    public Page<AdminVenueResponse> getAllVenues(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        return venueRepository
                .findAll(pageable)
                .map(venue -> AdminVenueResponse.builder()
                        .id(venue.getId())
                        .name(venue.getName())
                        .district(venue.getDistrict())
                        .address(venue.getAddress())
                        .capacity(venue.getCapacity())
                        .ownerName(venue.getOwner().getName())
                        .ownerEmail(venue.getOwner().getEmail())
                        .status(venue.getStatus())
                        .build());
    }


    @Override
    public Page<AdminUserResponse> getUsers(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        return userRepository
                .findByRole(Role.USER, pageable)
                .map(user -> AdminUserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .role(user.getRole())
                        .build());
    }

    @Override
    public Page<AdminUserResponse> getVendors(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        return userRepository
                .findByRole(Role.VENDOR, pageable)
                .map(user -> AdminUserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .role(user.getRole())
                        .build());
    }
}