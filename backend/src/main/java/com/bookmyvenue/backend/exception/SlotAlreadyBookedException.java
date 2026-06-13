package com.bookmyvenue.backend.exception;

public class SlotAlreadyBookedException
        extends RuntimeException {

    public SlotAlreadyBookedException(
            String message) {
        super(message);
    }
}