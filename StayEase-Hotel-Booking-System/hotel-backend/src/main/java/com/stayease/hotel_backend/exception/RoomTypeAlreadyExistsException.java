package com.stayease.hotel_backend.exception;

public class RoomTypeAlreadyExistsException extends RuntimeException {

    public RoomTypeAlreadyExistsException(String name) {
        super("Room Type already exists: " + name);
    }
}