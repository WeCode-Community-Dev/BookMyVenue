package com.example.bookMyVenue.Venue.Controller;

import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Venue.DTO.VenueRequest;
import com.example.bookMyVenue.Venue.DTO.VenueResponse;
import com.example.bookMyVenue.Venue.Service.OwnerVenueService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/owner/venue")
@AllArgsConstructor
public class OwnerVenueController {
    private final OwnerVenueService ownerVenueService;

    private final Validator validator;

//    @GetMapping("/ping")
//    public String ping() {
//        return "pong";
//    }
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VenueResponse> createVenue( @RequestPart("request") String request,
                                                     @RequestPart("images") List<MultipartFile> images){
        VenueRequest venueRequest =
                new ObjectMapper().readValue(request, VenueRequest.class);
        Set<ConstraintViolation<VenueRequest>> violations =
                validator.validate(venueRequest);

        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        VenueResponse venueResponse = ownerVenueService.createVenue(venueRequest,images);
        return ResponseEntity.ok().body(venueResponse);

    }
//    @GetMapping
//    public ResponseEntity<List<VenueResponse>> getAllVenue(){
//        return ResponseEntity
//                .status(HttpStatus.OK)
//                .body(ownerVenueService.getAllVenue());
//    }

    @PutMapping("/{id}")
    public ResponseEntity<VenueResponse> updateVenue(@RequestParam Long id,
                                                     @Valid @ModelAttribute VenueRequest venueRequest){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ownerVenueService.updateVenue(id,venueRequest));

    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueResponse> getVenueByParam(@RequestParam Long id){
        return ResponseEntity
                .ok(ownerVenueService.getVenueReponseById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenueByParam(@RequestParam Long id){
        ownerVenueService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping()
    public ResponseEntity<List<VenueResponse>> getMyVenues(Authentication authentication) {
        return ResponseEntity.ok(
                ownerVenueService.getVenuesByOwner(authentication.getName())
        );
    }

    @GetMapping("/approved")
    public ResponseEntity<List<VenueResponse>> getMyApprovedVenues(Authentication authentication) {
        return ResponseEntity.ok(
                ownerVenueService.getVenuesByOwnerAndStatus(authentication.getName(), VenueVerificationStatus.VERIFIED)
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<VenueResponse>> getMyPendingVenues(Authentication authentication) {
        return ResponseEntity.ok(
                ownerVenueService.getVenuesByOwnerAndStatus(authentication.getName(), VenueVerificationStatus.PENDING)
        );
    }

    @GetMapping("/rejected")
    public ResponseEntity<List<VenueResponse>> getMyRejectedVenues(Authentication authentication) {
        return ResponseEntity.ok(
                ownerVenueService.getVenuesByOwnerAndStatus(authentication.getName(), VenueVerificationStatus.REJECTED)
        );
    }

    @PutMapping("/{venueId}/resubmit")
    public ResponseEntity<String> resubmitVenue(
            @PathVariable Long venueId,
            Authentication authentication) {

        ownerVenueService.resubmitVenue(venueId, authentication.getName());
        return ResponseEntity.ok("Venue resubmitted for approval successfully");
    }

}
