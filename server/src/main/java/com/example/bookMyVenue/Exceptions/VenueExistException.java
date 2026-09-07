package com.example.bookMyVenue.Exceptions;

public class VenueExistException extends RuntimeException{

    public  VenueExistException(String venueName){
        super("Venue with this name "+venueName+" already Exist");
    }
}
