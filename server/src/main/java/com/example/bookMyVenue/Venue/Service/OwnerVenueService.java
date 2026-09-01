package com.example.bookMyVenue.Venue.Service;

import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Auth.Repository.UserRepo;
import com.example.bookMyVenue.Common.SystemConstants;
import com.example.bookMyVenue.Config.RuntimeUser;
import com.example.bookMyVenue.Enums.AmenityType;
import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueType;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Exceptions.NoSuchVenueException;
import com.example.bookMyVenue.Exceptions.SaveFailedException;
import com.example.bookMyVenue.Exceptions.VenueExistException;
import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityRulesRequest;
import com.example.bookMyVenue.Venue.DTO.VenueRequest;
import com.example.bookMyVenue.Venue.DTO.VenueResponse;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueImages;
import com.example.bookMyVenue.Venue.Repository.OwnerVenueRepo;
import com.example.bookMyVenue.Venue.Repository.VenueRepo;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.example.bookMyVenue.Common.APP_MSG.FILE_UPLOAD_ERR;
import static com.example.bookMyVenue.Common.SystemUtil.createFileName;

@Service
@AllArgsConstructor
public class OwnerVenueService {

    private final OwnerVenueRepo ownerVenueRepo;
    private final VenueAvailabilityRulesService venueAvailabilityRulesService;
    private final VenueService venueService;
    private final UserRepo userRepo;
    private final VenueRepo venueRepo;
    private final RuntimeUser runtimeUser;






    @Transactional
    public VenueResponse createVenue(VenueRequest venueRequest, List<MultipartFile> images) {

        if (ownerVenueRepo.existsByName(venueRequest.getName())) {
            throw new VenueExistException(venueRequest.getName());
        }
//        venueService.validateAvailabilityRules(venueRequest.getVenueAvailabilityRulesRequest());

        List<VenueImages> venueImagesList = uploadVenueImages(images, venueRequest.getName());
        Venue venue = mapToVenue(venueRequest, venueImagesList);

        if (venue.getImageFiles() != null) {
            for (VenueImages img : venue.getImageFiles()) {
                img.setVenue(venue);
            }
        }

        Venue savedVenue = ownerVenueRepo.save(venue);

        venueAvailabilityRulesService.createDefaultRule(
                savedVenue,
                venueRequest.getVenueAvailabilityRulesRequest()
                );

        return venueService.mapToVenueResponse(savedVenue);
    }


//    public List<VenueResponse> getAllVenue() {
//        User user =(User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//         //NCL: will be change after authentication then set session user
//        List<Venue> venueListFromDbByowner = ownerVenueRepo.findAllByOwner(user);
//        List<VenueResponse> venueResponseListByOwner = new ArrayList<>();
//        for (Venue v : venueListFromDbByowner) {
//            venueResponseListByOwner.add(venueService.mapToVenueResponse(v));
//        }
//        return venueResponseListByOwner;
//    }

    public Venue getVenueById(Long id) {
        return ownerVenueRepo.findById(id).orElseThrow(() -> new NoSuchVenueException("Venue is not existing " + id));
    }

    public VenueResponse getVenueReponseById(Long id) {
        return venueService.mapToVenueResponse(getVenueById(id));
    }

    public VenueResponse updateVenue(Long id, VenueRequest venueRequest) {
        Venue updatedVenue = UpdateExistingVenue(id, venueRequest);
        return venueService.mapToVenueResponse(ownerVenueRepo.save(updatedVenue));
    }

    public void deleteById(Long id) {
        Venue existingVenue = getVenueById(id);
        ownerVenueRepo.deleteById(id);
    }


//  Utility Functions...


    private Venue UpdateExistingVenue(Long id, VenueRequest venueRequest) {
        Venue existingVenue = getVenueById(id);
        existingVenue.setAddress(venueRequest.getAddress());
        existingVenue.setName(venueRequest.getName());
        existingVenue.setDescription(venueRequest.getDescription());
        existingVenue.setCity(venueRequest.getCity());
// NFD       List<MultipartFile> imageFiles
        return existingVenue;
    }

    private Venue mapToVenue(VenueRequest venueRequest, List<VenueImages> venueImages) {
        User owner = runtimeUser.getUser();
        return Venue.builder()
                .owner(owner)
                .city(venueRequest.getCity())
                .name(venueRequest.getName())
                .address(venueRequest.getAddress())
                .description(venueRequest.getDescription())
                .venueVerificationStatus(VenueVerificationStatus.PENDING)
                .venueActiveStatus(VenueActiveStatus.INACTIVE)
                .createdAt(LocalDateTime.now())
                .imageFiles(venueImages)
                .amenities(venueRequest.getAmenities())
                .parkingAvailble(venueRequest.getParking())
                .seatingCapacity(venueRequest.getSeatingCapacity())
                .venueType(venueRequest.getVenueType())
                .maxAdvanceBookingDays(venueRequest.getMaxAdvanceBookingDays())
                .build();

    }






    private List<VenueImages> uploadVenueImages(@Size(min = 1,max = 4) List<MultipartFile> imageFiles,String venueName) {
        try {
            String ParentFolderString = venueName.toUpperCase() + "_IMG";
            Path venueUploadFilePath = Paths.get(SystemConstants.UPLOAD_DIR + "/venueImages/" + ParentFolderString);
            Files.createDirectories(venueUploadFilePath);
            List<VenueImages> venuesImagesList = new ArrayList<>();
            for (MultipartFile imageFile : imageFiles) {
                if ((!imageFile.isEmpty()) && imageFile.getOriginalFilename() != null) {
                        String newFileName = createFileName(imageFile.getOriginalFilename());
                        Files.copy(imageFile.getInputStream(), venueUploadFilePath.resolve(newFileName), StandardCopyOption.REPLACE_EXISTING);
                        venuesImagesList.add(VenueImages.builder()
                                .fileLocation(venueUploadFilePath.toString()+"/"+newFileName)
                                .build());
                }
            }
            return venuesImagesList;
        } catch (Exception exp) {
            throw new RuntimeException(FILE_UPLOAD_ERR, exp);
        }
    }
    public List<VenueResponse> getVenuesByOwner(String ownerEmail) {
        User owner = runtimeUser.getUser();
        return venueRepo.findByOwner(owner).stream()
                .map(venueService::mapToVenueResponse)
                .toList();
    }

    public List<VenueResponse> getVenuesByOwnerAndStatus(String ownerEmail, VenueVerificationStatus status) {

        User owner = runtimeUser.getUser();
        return venueRepo.findByOwnerAndVenueVerificationStatus(owner, status).stream()
                .map(venueService::mapToVenueResponse)
                .toList();
    }

    @Transactional
    public void resubmitVenue(Long venueId, String ownerEmail) {
        Venue venue = venueRepo.findById(venueId)
                .orElseThrow(() -> new NoSuchVenueException("Venue not found"));

        if (!venue.getOwner().getEmail().equals(ownerEmail)) {
            throw new AccessDeniedException("You do not own this venue");
        }

        if (venue.getVenueVerificationStatus() != VenueVerificationStatus.REJECTED) {
            throw new IllegalStateException("Only rejected venues can be resubmitted");
        }

        venue.setVenueVerificationStatus(VenueVerificationStatus.PENDING);
        venueRepo.save(venue);


    }
}
