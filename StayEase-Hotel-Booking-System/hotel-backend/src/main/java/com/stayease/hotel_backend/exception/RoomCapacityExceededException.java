package com.stayease.hotel_backend.exception;

public class RoomCapacityExceededException extends RuntimeException {

    public RoomCapacityExceededException(Integer capacity) {
        super("Room capacity exceeded. Maximum allowed guests: " + capacity);
    }
}