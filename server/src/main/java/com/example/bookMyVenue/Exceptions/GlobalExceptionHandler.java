package com.example.bookMyVenue.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SaveFailedException.class)
    public ResponseEntity<?> handleSaveFailedException(
            RuntimeException ex) {

        return ResponseEntity.badRequest()
                .body(Map.of(
                        "success", false,
                        "message", ex.getMessage()
                ));
    }
    @ExceptionHandler(NoSuchVenueException.class)
    public ResponseEntity<?> handleGetVenueByIDException(NoSuchVenueException ex){
        return ResponseEntity.badRequest()
                .body(Map.of(
                        "success", false,
                        "message", ex.getMessage()
                ));
    }
}
