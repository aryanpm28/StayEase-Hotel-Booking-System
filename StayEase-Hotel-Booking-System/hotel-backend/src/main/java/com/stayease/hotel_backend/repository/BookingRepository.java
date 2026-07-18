package com.stayease.hotel_backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stayease.hotel_backend.entity.Booking;
import com.stayease.hotel_backend.entity.Customer;
import com.stayease.hotel_backend.entity.Room;
import com.stayease.hotel_backend.enums.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomer(Customer customer);

    boolean existsByRoomIdAndBookingStatusNotAndCheckInDateLessThanAndCheckOutDateGreaterThan(
            Long roomId,
            BookingStatus bookingStatus,
            LocalDate checkOutDate,
            LocalDate checkInDate);

    boolean existsByCustomerAndRoomAndBookingStatus(
            Customer customer,
            Room room,
            BookingStatus bookingStatus);

    boolean existsByRoomAndBookingStatusIn(
            Room room,
            List<BookingStatus> bookingStatuses);

}