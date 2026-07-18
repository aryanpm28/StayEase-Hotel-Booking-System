package com.stayease.hotel_backend.dto.payment;

import com.stayease.hotel_backend.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequestDTO {

    @NotNull(message = "Booking Id is required")
    private Long bookingId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

}