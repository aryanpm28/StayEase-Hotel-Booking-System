package com.stayease.hotel_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stayease.hotel_backend.dto.booking.BookingRequestDTO;
import com.stayease.hotel_backend.dto.booking.BookingResponseDTO;
import com.stayease.hotel_backend.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // Customer or Admin can book
    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<BookingResponseDTO> bookRoom(
            @Valid @RequestBody BookingRequestDTO dto) {

        BookingResponseDTO booking = bookingService.bookRoom(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    // Customer sees their own bookings; Admin sees all (service layer scopes this)
    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings());
    }

    // Customer or Admin
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id));
    }

    // Customer or Admin
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id) {

        bookingService.cancelBooking(id);

        return ResponseEntity.noContent().build();
    }

}