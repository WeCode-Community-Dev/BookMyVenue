package com.bookmyvenue.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookmyvenue.dto.VenueRequest;
import com.bookmyvenue.dto.VenueResponse;
import com.bookmyvenue.dto.VenueUpdateRequest;
import com.bookmyvenue.service.OwnerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/owner")
@RequiredArgsConstructor
public class OwnerController {
   private final OwnerService ownerService;

    @PostMapping("/venue/register")
    public ResponseEntity<VenueResponse> createVenue (@RequestBody VenueRequest request, @AuthenticationPrincipal UserDetails userDetails)
        {

        VenueResponse response = ownerService.createVenue(request,userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/venue/owner")
    public ResponseEntity<List<VenueResponse>> getMyVenues(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(ownerService.getMyVenues(userDetails.getUsername()));
    }

    @PutMapping("/update/venue/{id}")
    public ResponseEntity<VenueResponse> updateVenue(@PathVariable Integer id, @RequestBody VenueUpdateRequest request, @AuthenticationPrincipal UserDetails userDetails){
        System.out.println("update test");
        VenueResponse response = ownerService.updateVenue(id , request, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("delete/venue/{id}")
    public ResponseEntity<String>deleteVenue(@PathVariable Integer id, @AuthenticationPrincipal UserDetails userDetails){
        ownerService.deleteVenue(id, userDetails.getUsername());
        return ResponseEntity.ok("Venue Deleted successfully");
    }
}
