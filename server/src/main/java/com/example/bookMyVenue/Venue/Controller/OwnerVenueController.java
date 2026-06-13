package com.example.bookMyVenue.Venue.Controller;

import com.example.bookMyVenue.Venue.DTO.VenueRequest;
import com.example.bookMyVenue.Venue.DTO.VenueResponse;
import com.example.bookMyVenue.Venue.Service.OwnerVenueService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/venue")
@AllArgsConstructor
public class OwnerVenueController {
    private final OwnerVenueService ownerVenueService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VenueResponse> createVenue(@Valid @ModelAttribute VenueRequest venueRequest){
        VenueResponse venueResponse = ownerVenueService.createVenue(venueRequest);
        return ResponseEntity.ok().body(venueResponse);

    }
    @GetMapping
    public ResponseEntity<List<VenueResponse>> getAllVenue(){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ownerVenueService.getAllVenue());
    }

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
                .ok(ownerVenueService.mapToVenueResponse(ownerVenueService.getVenueById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVenueByParam(@RequestParam Long id){
        ownerVenueService.deleteById(id);
        return ResponseEntity.ok().build();
    }

//    @DeleteMapping("/deleteByList")
//    public ResponseEntity<?> deleteVenueByParam(List<Long> deleteIds){
//
//        ownerVenueService.deleteByIdList
//    }
}
