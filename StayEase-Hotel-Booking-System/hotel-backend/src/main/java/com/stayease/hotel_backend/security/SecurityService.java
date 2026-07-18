package com.stayease.hotel_backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.stayease.hotel_backend.entity.Customer;
import com.stayease.hotel_backend.exception.CustomerNotFoundException;
import com.stayease.hotel_backend.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final CustomerRepository customerRepository;

    public Customer getCurrentCustomer() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new CustomerNotFoundException("Customer not found: " + email));
    }

    public boolean isAdmin() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}