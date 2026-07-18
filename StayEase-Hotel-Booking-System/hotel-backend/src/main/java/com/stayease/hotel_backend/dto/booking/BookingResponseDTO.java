package com.stayease.hotel_backend.dto.booking;

import java.time.LocalDate;

import com.stayease.hotel_backend.enums.BookingStatus;

import lombok.Data;

@Data
public class BookingResponseDTO {

    private Long bookingId;

    private String customerName;

    private String roomNumber;

    private String roomType;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private Integer numberOfGuests;

    private Double totalPrice;

    private BookingStatus bookingStatus;

}