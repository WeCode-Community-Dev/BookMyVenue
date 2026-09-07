package com.example.bookMyVenue.Exceptions;

public class SaveFailedException extends RuntimeException{
    public  SaveFailedException(Exception e){
        super(e);
    }
}
