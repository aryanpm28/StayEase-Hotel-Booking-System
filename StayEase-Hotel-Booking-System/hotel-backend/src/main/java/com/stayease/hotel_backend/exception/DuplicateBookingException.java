package com.stayease.hotel_backend.exception;

public class DuplicateBookingException extends RuntimeException {

    public DuplicateBookingException() {
        super("You already have an active booking for this room.");
    }
}