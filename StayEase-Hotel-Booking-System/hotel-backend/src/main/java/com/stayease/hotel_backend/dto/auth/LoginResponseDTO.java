package com.stayease.hotel_backend.dto.auth;

import com.stayease.hotel_backend.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private Role role;

    private String token;
}