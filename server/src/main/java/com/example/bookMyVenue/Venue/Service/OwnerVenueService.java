package com.example.bookMyVenue.Venue.Service;

import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Common.SystemConstants;
import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Exceptions.NoSuchVenueException;
import com.example.bookMyVenue.Exceptions.SaveFailedException;
import com.example.bookMyVenue.Venue.DTO.VenueRequest;
import com.example.bookMyVenue.Venue.DTO.VenueResponse;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueImages;
import com.example.bookMyVenue.Venue.Repository.OwnerVenueRepo;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.example.bookMyVenue.Common.APP_ERR.FILE_UPLOAD_ERR;
import static com.example.bookMyVenue.Common.SystemUtil.createFileName;

@Service
@AllArgsConstructor
public class OwnerVenueService {

    private final OwnerVenueRepo ownerVenueRepo;

    public VenueResponse createVenue(VenueRequest venueRequest) {
        try {
            List<VenueImages> VenueImagesList= uploadVenueImages(venueRequest.getImageFiles(),venueRequest.getName());

            Venue savedVenue = ownerVenueRepo.save(mapToVenue(venueRequest,VenueImagesList));
            return mapToVenueResponse(savedVenue);
        } catch (Exception e) {
            throw new SaveFailedException(e);

        }
    }


    public List<VenueResponse> getAllVenue() {
        User owner = new User();  //NCL: will be change after authentication then set session user
        List<Venue> venueListFromDbByowner = ownerVenueRepo.findAllByOwner(owner);
        List<VenueResponse> venueResponseListByOwner = new ArrayList<>();
        for (Venue v : venueListFromDbByowner) {
            venueResponseListByOwner.add(mapToVenueResponse(v));
        }
        return venueResponseListByOwner;
    }

    public Venue getVenueById(Long id) {
        return ownerVenueRepo.findById(id).orElseThrow(() -> new NoSuchVenueException("Venue is not existing " + id));
    }

    public VenueResponse updateVenue(Long id, VenueRequest venueRequest) {
        Venue updatedVenue = UpdateExistingVenue(id, venueRequest);
        return mapToVenueResponse(ownerVenueRepo.save(updatedVenue));
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

    private Venue mapToVenue(VenueRequest venueRequest,List<VenueImages>  venueImages) {
        return Venue.builder()
                .city(venueRequest.getCity())
                .name(venueRequest.getName())
                .address(venueRequest.getAddress())
                .description(venueRequest.getDescription())
                .venueVerificationStatus(VenueVerificationStatus.PENDING)
                .venueActiveStatus(VenueActiveStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .imageFiles(venueImages)
                .build();
    }

    public VenueResponse mapToVenueResponse(Venue v) {
        return VenueResponse.builder()
                .VenueName(v.getName())
                .status(v.getVenueActiveStatus().name())
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
}
