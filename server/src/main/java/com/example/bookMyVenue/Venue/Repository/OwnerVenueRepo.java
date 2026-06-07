package com.example.bookMyVenue.Venue.Repository;

import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Venue.Model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OwnerVenueRepo extends JpaRepository<Venue,Long> {


    public List<Venue> findAllByOwner(User owner);



}
