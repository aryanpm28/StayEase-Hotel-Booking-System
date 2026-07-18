package com.stayease.hotel_backend.exception;

public class InvalidBookingDatesException extends RuntimeException {

    public InvalidBookingDatesException() {
        super("Check-out date must be after check-in date.");
    }
}