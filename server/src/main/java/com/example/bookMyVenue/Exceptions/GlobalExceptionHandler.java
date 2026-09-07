package com.example.bookMyVenue.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleException(MethodArgumentNotValidException methodArgumentNotValidException){
            Map<String,String> map =new HashMap<>();
        methodArgumentNotValidException.getBindingResult().getFieldErrors().forEach(error->
                map.put(error.getField(),error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(map);
    }
    @ExceptionHandler(UpdateVenueStatusException.class)
    public ResponseEntity<?> handleGetVenueByIDException(UpdateVenueStatusException ex){
        log.error(ex.getMessage());
        return ResponseEntity.badRequest()
                .body(Map.of(
                        "success", false,
                        "message", "Status Updation Failed"
                ));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleGetVenueByIDException(UserNotFoundException ex){
        log.error(ex.getMessage());
        return ResponseEntity.badRequest()
                .body(Map.of(
                        "success", false,
                        "message", "No Such User Exists"
                ));
    }
    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<?> handleBookingNotFoundException(BookingNotFoundException ex){
        log.error(ex.getMessage());
        return ResponseEntity.badRequest()
                .body(Map.of(
                        "success", false,
                        "message", "No Bookings Exists"
                ));
    }

}
