package com.example.bookMyVenue.Exceptions;

public class BookingNotFoundException extends RuntimeException{
    public BookingNotFoundException(String msg){
        super(msg);
    }
}
