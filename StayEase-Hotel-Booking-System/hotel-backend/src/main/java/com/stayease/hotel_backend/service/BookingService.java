package com.stayease.hotel_backend.service;

import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.stayease.hotel_backend.dto.booking.BookingRequestDTO;
import com.stayease.hotel_backend.dto.booking.BookingResponseDTO;
import com.stayease.hotel_backend.entity.Booking;
import com.stayease.hotel_backend.entity.Customer;
import com.stayease.hotel_backend.entity.Room;
import com.stayease.hotel_backend.enums.BookingStatus;
import com.stayease.hotel_backend.exception.BookingNotFoundException;
import com.stayease.hotel_backend.exception.CustomerNotFoundException;
import com.stayease.hotel_backend.exception.DuplicateBookingException;
import com.stayease.hotel_backend.exception.InvalidBookingDatesException;
import com.stayease.hotel_backend.exception.RoomAlreadyBookedException;
import com.stayease.hotel_backend.exception.RoomCapacityExceededException;
import com.stayease.hotel_backend.exception.RoomNotFoundException;
import com.stayease.hotel_backend.repository.BookingRepository;
import com.stayease.hotel_backend.repository.CustomerRepository;
import com.stayease.hotel_backend.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.stayease.hotel_backend.security.SecurityService;

@Service
@RequiredArgsConstructor
public class BookingService {

        private final BookingRepository bookingRepository;
        private final CustomerRepository customerRepository;
        private final RoomRepository roomRepository;
        private final SecurityService securityService;

        // ==========================
        // Convert Entity -> Response DTO
        // ===========================

        private BookingResponseDTO mapToResponseDTO(Booking booking) {

                BookingResponseDTO dto = new BookingResponseDTO();

                dto.setBookingId(booking.getId());

                dto.setCustomerName(
                                booking.getCustomer().getFirstName() + " "
                                                + booking.getCustomer().getLastName());

                dto.setRoomNumber(
                                booking.getRoom().getRoomNumber());

                dto.setRoomType(
                                booking.getRoom().getRoomType().getName());

                dto.setCheckInDate(
                                booking.getCheckInDate());

                dto.setCheckOutDate(
                                booking.getCheckOutDate());

                dto.setNumberOfGuests(
                                booking.getNumberOfGuests());

                dto.setTotalPrice(
                                booking.getTotalPrice());

                dto.setBookingStatus(
                                booking.getBookingStatus());

                return dto;
        }

        private Customer getCurrentCustomer() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                String email = authentication.getName();

                return customerRepository.findByEmail(email)
                                .orElseThrow(() -> new CustomerNotFoundException(email));
        }

        // ===========================
        // Create Booking
        // ===========================

        public BookingResponseDTO bookRoom(BookingRequestDTO dto) {

                Customer customer = getCurrentCustomer();

                Room room = roomRepository.findById(dto.getRoomId())
                                .orElseThrow(() -> new RoomNotFoundException(dto.getRoomId()));

                if (dto.getNumberOfGuests() > room.getCapacity()) {
                        throw new RoomCapacityExceededException(room.getCapacity());
                }

                // Check if room is already booked for the requested dates
                boolean roomBooked = bookingRepository
                                .existsByRoomIdAndBookingStatusNotAndCheckInDateLessThanAndCheckOutDateGreaterThan(
                                                room.getId(),
                                                BookingStatus.CANCELLED,
                                                dto.getCheckOutDate(),
                                                dto.getCheckInDate());

                if (bookingRepository.existsByCustomerAndRoomAndBookingStatus(
                                customer,
                                room,
                                BookingStatus.BOOKED)) {

                        throw new DuplicateBookingException();
                }

                if (roomBooked) {
                        throw new RoomAlreadyBookedException();
                }

                long days = ChronoUnit.DAYS.between(
                                dto.getCheckInDate(),
                                dto.getCheckOutDate());

                if (days <= 0) {
                        throw new InvalidBookingDatesException();
                }

                double totalPrice = room.getRoomType().getPricePerNight() * days;

                Booking booking = new Booking();

                booking.setCustomer(customer);
                booking.setRoom(room);
                booking.setCheckInDate(dto.getCheckInDate());
                booking.setCheckOutDate(dto.getCheckOutDate());
                booking.setNumberOfGuests(dto.getNumberOfGuests());
                booking.setTotalPrice(totalPrice);
                booking.setBookingStatus(BookingStatus.BOOKED);

                Booking savedBooking = bookingRepository.save(booking);

                return mapToResponseDTO(savedBooking);
        }
        // ===========================
        // Get Booking By Id
        // ===========================

        public BookingResponseDTO getBookingById(Long id) {

                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new BookingNotFoundException(id));

                // Admin can view any booking
                if (securityService.isAdmin()) {
                        return mapToResponseDTO(booking);
                }

                // Logged-in customer
                Customer currentCustomer = securityService.getCurrentCustomer();

                // Customer trying to access someone else's booking
                if (!booking.getCustomer().getId().equals(currentCustomer.getId())) {
                        throw new BookingNotFoundException(id);
                }

                return mapToResponseDTO(booking);
        }

        // ===========================
        // Get All Bookings
        // ===========================

        public List<BookingResponseDTO> getAllBookings() {

                // Admin can view all bookings
                if (securityService.isAdmin()) {

                        return bookingRepository.findAll()
                                        .stream()
                                        .map(this::mapToResponseDTO)
                                        .toList();
                }

                // Customer can view only their own bookings
                Customer customer = securityService.getCurrentCustomer();

                return bookingRepository.findByCustomer(customer)
                                .stream()
                                .map(this::mapToResponseDTO)
                                .toList();
        }

        // ===========================
        // Cancel Booking
        // ===========================

        public void cancelBooking(Long id) {

                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new BookingNotFoundException(id));

                if (!securityService.isAdmin()) {

                        Customer currentCustomer = securityService.getCurrentCustomer();

                        if (!booking.getCustomer().getId().equals(currentCustomer.getId())) {
                                throw new BookingNotFoundException(id);
                        }
                }

                booking.setBookingStatus(BookingStatus.CANCELLED);

                bookingRepository.save(booking);
        }
}