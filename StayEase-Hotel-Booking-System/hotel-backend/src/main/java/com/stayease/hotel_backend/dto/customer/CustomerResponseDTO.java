package com.stayease.hotel_backend.dto.customer;

import lombok.Data;

@Data
public class CustomerResponseDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String address;
}