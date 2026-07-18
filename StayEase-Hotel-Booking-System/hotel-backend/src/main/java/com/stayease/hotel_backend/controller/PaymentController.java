package com.stayease.hotel_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.stayease.hotel_backend.dto.payment.PaymentRequestDTO;
import com.stayease.hotel_backend.dto.payment.PaymentResponseDTO;
import com.stayease.hotel_backend.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ==========================
    // Create Payment
    // ==========================

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponseDTO makePayment(
            @Valid @RequestBody PaymentRequestDTO dto) {

        return paymentService.makePayment(dto);
    }

    // ==========================
    // Get All Payments (customer sees own, admin sees all — service scopes this)
    // ==========================

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public List<PaymentResponseDTO> getAllPayments() {

        return paymentService.getAllPayments();
    }

    // ==========================
    // Get Payment By Id
    // ==========================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public PaymentResponseDTO getPaymentById(
            @PathVariable Long id) {

        return paymentService.getPaymentById(id);
    }

}