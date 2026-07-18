package com.stayease.hotel_backend.service;

import org.springframework.stereotype.Service;

import com.stayease.hotel_backend.dto.auth.AuthRequestDTO;
import com.stayease.hotel_backend.dto.auth.AuthResponseDTO;
import com.stayease.hotel_backend.dto.auth.RegisterRequestDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    public AuthResponseDTO register(RegisterRequestDTO request) {

        // We'll implement this after JWT setup
        return null;
    }

    public AuthResponseDTO login(AuthRequestDTO request) {

        // We'll implement this after JWT setup
        return null;
    }
}