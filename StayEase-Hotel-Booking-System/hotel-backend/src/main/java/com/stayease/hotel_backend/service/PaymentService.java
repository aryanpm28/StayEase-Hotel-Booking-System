package com.stayease.hotel_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.stayease.hotel_backend.dto.payment.PaymentRequestDTO;
import com.stayease.hotel_backend.dto.payment.PaymentResponseDTO;
import com.stayease.hotel_backend.entity.Booking;
import com.stayease.hotel_backend.entity.Customer;
import com.stayease.hotel_backend.entity.Payment;
import com.stayease.hotel_backend.enums.PaymentStatus;
import com.stayease.hotel_backend.exception.BookingNotFoundException;
import com.stayease.hotel_backend.exception.PaymentAlreadyExistsException;
import com.stayease.hotel_backend.exception.PaymentNotFoundException;
import com.stayease.hotel_backend.repository.BookingRepository;
import com.stayease.hotel_backend.repository.PaymentRepository;
import com.stayease.hotel_backend.security.SecurityService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final SecurityService securityService;

    // ==========================
    // Entity -> DTO
    // ==========================

    private PaymentResponseDTO mapToResponseDTO(Payment payment) {

        PaymentResponseDTO dto = new PaymentResponseDTO();

        dto.setPaymentId(payment.getId());

        dto.setBookingId(payment.getBooking().getId());

        dto.setCustomerName(
                payment.getBooking().getCustomer().getFirstName()
                        + " "
                        + payment.getBooking().getCustomer().getLastName());

        dto.setAmount(payment.getAmount());

        dto.setPaymentMethod(payment.getPaymentMethod());

        dto.setPaymentStatus(payment.getPaymentStatus());

        dto.setTransactionId(payment.getTransactionId());

        dto.setPaymentDate(payment.getPaymentDate());

        return dto;
    }

    // ==========================
    // Create Payment
    // ==========================

    public PaymentResponseDTO makePayment(PaymentRequestDTO dto) {

        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new BookingNotFoundException(dto.getBookingId()));

        // Customer can only pay for their own booking
        if (!securityService.isAdmin()) {

            Customer currentCustomer = securityService.getCurrentCustomer();

            if (!booking.getCustomer().getId().equals(currentCustomer.getId())) {
                throw new BookingNotFoundException(dto.getBookingId());
            }
        }

        if (paymentRepository.findByBookingId(dto.getBookingId()).isPresent()) {
            throw new PaymentAlreadyExistsException(dto.getBookingId());
        }

        Payment payment = new Payment();

        payment.setBooking(booking);
        payment.setAmount(booking.getTotalPrice());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        return mapToResponseDTO(savedPayment);
    }

    // ==========================
    // Get All Payments
    // ==========================

    public List<PaymentResponseDTO> getAllPayments() {

        if (securityService.isAdmin()) {

            return paymentRepository.findAll()
                    .stream()
                    .map(this::mapToResponseDTO)
                    .toList();
        }

        Customer currentCustomer = securityService.getCurrentCustomer();

        return paymentRepository.findByBookingCustomer(currentCustomer)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    // ==========================
    // Get Payment By Id
    // ==========================

    public PaymentResponseDTO getPaymentById(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException(id));

        // Admin can view any payment
        if (securityService.isAdmin()) {
            return mapToResponseDTO(payment);
        }

        Customer currentCustomer = securityService.getCurrentCustomer();

        if (!payment.getBooking().getCustomer().getId().equals(currentCustomer.getId())) {
            throw new PaymentNotFoundException(id);
        }

        return mapToResponseDTO(payment);
    }

}