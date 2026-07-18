package com.stayease.hotel_backend.exception;

public class RoomAlreadyBookedException extends RuntimeException {

    public RoomAlreadyBookedException() {
        super("Room is already booked for the selected dates.");
    }
}