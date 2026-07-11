package com.example.bookMyVenue.Venue.Service;

import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Enums.Role;
import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Exceptions.NoSuchVenueException;
import com.example.bookMyVenue.Exceptions.UpdateVenueStatusException;
import com.example.bookMyVenue.Venue.DTO.ActionRequest;
import com.example.bookMyVenue.Venue.DTO.VenueAvailabiltyRulesResponse;
import com.example.bookMyVenue.Venue.DTO.VenueResponse;
import com.example.bookMyVenue.Venue.Model.AdminVenueActionLog;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueImages;
import com.example.bookMyVenue.Venue.Repository.AdminVenueActionRepository;
import com.example.bookMyVenue.Venue.Repository.VenueRepo;
import com.example.bookMyVenue.Venue.Repository.VenueVerificationLogRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class VenueService {

    public final VenueRepo venueRepo;
    private final VenueAvailabilityRulesService venueAvailabilityRulesService;
    public final VenueVerificationLogRepo venueVerificationLogRepo;
    public final AdminVenueActionRepository adminVenueActionRepository;


    public List<Venue> getAllActiveVenues() {
        return venueRepo.findAllByVenueActiveStatus(VenueActiveStatus.ACTIVE);
    }

    public Venue getVenueById(Long id) {
        return venueRepo.findByIdAndVenueActiveStatus(id,VenueActiveStatus.ACTIVE).orElseThrow(()->new  NoSuchVenueException("No venue Exist by id" + id));

    }

    public VenueResponse mapToVenueResponse(Venue v) {
        VenueAvailabiltyRulesResponse activeRule =
                venueAvailabilityRulesService.getActiveRule(v.getId());
        List<String> imageFiles =v.getImageFiles().stream().map(VenueImages::getFileLocation).toList();
        return VenueResponse.builder()
                .id(v.getId())
                .venueType(v.getVenueType().name())
                .city(v.getCity())
                .parking(v.getParkingAvailble())
                .amenities(v.getAmenities())
                .name(v.getName())
                .description(v.getDescription())
                .address(v.getAddress())
                .seatingCapacity(v.getSeatingCapacity())
                .activeAvailabilityRule(activeRule)
                .imageFiles(imageFiles)
                .build();
    }



    public List<VenueResponse> getAllVenues() {
        List<VenueResponse> venueResponses = new ArrayList<>();
        for(Venue venue :venueRepo.findAll()){
            venueResponses.add(mapToVenueResponse(venue));
        }
        return venueResponses;
    }

    public List<VenueResponse> getVenuesByStatus(VenueVerificationStatus status) {

        List<VenueResponse> venueResponses = new ArrayList<>();
        for(Venue venue :venueRepo.findAllByVenueVerificationStatus(status)){
            venueResponses.add(mapToVenueResponse(venue));
        }
        return venueResponses;
    }
    public VenueResponse getVenueResponseById(Long id) {
        Venue venue =venueRepo.findById(id).orElseThrow(()->new  NoSuchVenueException("No venue Exist by id" + id));
        return mapToVenueResponse(venue);
    }

    @Transactional
    public void updateVenueStatus(Long venueId, VenueVerificationStatus status,ActionRequest request) {
        Venue venue = venueRepo.findById(venueId)
                .orElseThrow(() -> new NoSuchVenueException("Venue not found"));
        venue.setVenueVerificationStatus(status);
        if(status==VenueVerificationStatus.VERIFIED) {
            venue.setVenueActiveStatus(VenueActiveStatus.ACTIVE);
        }else{
            venue.setVenueActiveStatus(VenueActiveStatus.INACTIVE);
        }
        venueRepo.save(venue);
        User user =(User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(user.getRole()!= Role.ADMIN){
            throw new UpdateVenueStatusException("Venue Verification Action is not done by an Admin");
        }

        AdminVenueActionLog log = AdminVenueActionLog.builder()
                .venue(venue)
                .action(status)
                .reason(request != null ? request.getReason() : null)
                .admin(user)
                .build();

        adminVenueActionRepository.save(log);
    }
}
