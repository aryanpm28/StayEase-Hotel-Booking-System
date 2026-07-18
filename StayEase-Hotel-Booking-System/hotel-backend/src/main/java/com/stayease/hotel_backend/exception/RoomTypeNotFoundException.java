package com.stayease.hotel_backend.exception;

public class RoomTypeNotFoundException extends RuntimeException {

    public RoomTypeNotFoundException(Long id) {
        super("Room Type not found with id: " + id);
    }
}