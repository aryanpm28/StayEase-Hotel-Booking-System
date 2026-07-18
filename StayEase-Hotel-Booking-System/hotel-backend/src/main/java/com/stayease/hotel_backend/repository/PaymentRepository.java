package com.stayease.hotel_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stayease.hotel_backend.entity.Customer;
import com.stayease.hotel_backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByBookingId(Long bookingId);

    boolean existsByTransactionId(String transactionId);

    List<Payment> findByBookingCustomer(Customer customer);

}