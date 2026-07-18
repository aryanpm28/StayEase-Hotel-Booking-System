package com.stayease.hotel_backend.exception;

public class RoomNotFoundException extends RuntimeException {

    public RoomNotFoundException(Long id) {
        super("Room not found with id: " + id);
    }
}