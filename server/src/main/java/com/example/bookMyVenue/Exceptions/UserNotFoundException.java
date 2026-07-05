package com.example.bookMyVenue.Exceptions;

public class UserNotFoundException extends RuntimeException{
    public  UserNotFoundException(String exc){
        super(exc);
    }
}
