package com.stayease.hotel_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stayease.hotel_backend.dto.customer.CustomerRequestDTO;
import com.stayease.hotel_backend.dto.customer.CustomerResponseDTO;
import com.stayease.hotel_backend.security.SecurityService;
import com.stayease.hotel_backend.service.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final SecurityService securityService;

    // Register (public)
    @PostMapping
    public ResponseEntity<CustomerResponseDTO> addCustomer(
            @Valid @RequestBody CustomerRequestDTO customerRequestDTO) {

        CustomerResponseDTO customer = customerService.saveCustomer(customerRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(customer);
    }

    // Current logged-in customer's own profile
    @GetMapping("/me")
    public ResponseEntity<CustomerResponseDTO> getMyProfile() {

        return ResponseEntity.ok(
                customerService.getCustomerById(
                        securityService.getCurrentCustomer().getId()));
    }

    // Update current logged-in customer's own profile
    @PutMapping("/me")
    public ResponseEntity<CustomerResponseDTO> updateMyProfile(
            @Valid @RequestBody CustomerRequestDTO customerRequestDTO) {

        Long id = securityService.getCurrentCustomer().getId();

        return ResponseEntity.ok(
                customerService.updateCustomer(id, customerRequestDTO));
    }

    // Get All Customers - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {

        return ResponseEntity.ok(
                customerService.getAllCustomers());
    }

    // Get Customer By ID - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                customerService.getCustomerById(id));
    }

    // Update Customer - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequestDTO customerRequestDTO) {

        CustomerResponseDTO customer = customerService.updateCustomer(id, customerRequestDTO);

        return ResponseEntity.ok(customer);
    }

    // Delete Customer - ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable Long id) {

        customerService.deleteCustomer(id);

        return ResponseEntity.noContent().build();
    }

}