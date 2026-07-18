package com.stayease.hotel_backend.dto.payment;

import java.time.LocalDateTime;

import com.stayease.hotel_backend.enums.PaymentMethod;
import com.stayease.hotel_backend.enums.PaymentStatus;

import lombok.Data;

@Data
public class PaymentResponseDTO {

    private Long paymentId;

    private Long bookingId;

    private String customerName;

    private Double amount;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private String transactionId;

    private LocalDateTime paymentDate;

}