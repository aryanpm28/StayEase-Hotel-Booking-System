package com.stayease.hotel_backend.exception;

public class CustomerNotFoundException extends RuntimeException {

    public CustomerNotFoundException(Long id) {
        super("Customer not found with id: " + id);
    }

    public CustomerNotFoundException(String email) {
        super("Customer not found with email: " + email);
    }
}