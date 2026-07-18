package com.stayease.hotel_backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.stayease.hotel_backend.entity.Booking;
import com.stayease.hotel_backend.enums.BookingStatus;
import com.stayease.hotel_backend.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingStatusScheduler {

    private final BookingRepository bookingRepository;

    @Scheduled(fixedRate = 60000) // every 60 seconds
    public void updateBookingStatuses() {

        List<Booking> bookings = bookingRepository.findAll();

        LocalDate today = LocalDate.now();

        for (Booking booking : bookings) {

            if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
                continue;
            }

            // Customer has checked out
            if (today.isAfter(booking.getCheckOutDate())) {

                booking.setBookingStatus(BookingStatus.CHECKED_OUT);

            }

            // Customer has checked in
            else if (!today.isBefore(booking.getCheckInDate())) {

                booking.setBookingStatus(BookingStatus.CHECKED_IN);

            }

            // Booking is upcoming
            else {

                booking.setBookingStatus(BookingStatus.BOOKED);

            }

            bookingRepository.save(booking);
        }
    }
}