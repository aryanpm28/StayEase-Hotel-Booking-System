package com.stayease.hotel_backend.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(RoomNotFoundException.class)
        public ResponseEntity<String> handleRoomNotFound(RoomNotFoundException ex) {
                return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, String>> handleValidation(
                        MethodArgumentNotValidException ex) {

                Map<String, String> errors = new HashMap<>();

                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(CustomerNotFoundException.class)
        public ResponseEntity<String> handleCustomerNotFound(
                        CustomerNotFoundException ex) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(ex.getMessage());
        }

        @ExceptionHandler(EmailAlreadyExistsException.class)
        public ResponseEntity<String> handleEmailAlreadyExists(
                        EmailAlreadyExistsException ex) {

                return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(ex.getMessage());
        }

        @ExceptionHandler(InvalidCredentialsException.class)
        public ResponseEntity<String> handleInvalidCredentials(
                        InvalidCredentialsException ex) {

                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(ex.getMessage());
        }

        @ExceptionHandler(RoomTypeAlreadyExistsException.class)
        public ResponseEntity<String> handleRoomTypeAlreadyExists(
                        RoomTypeAlreadyExistsException ex) {

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ex.getMessage());
        }

        @ExceptionHandler(BookingNotFoundException.class)
        public ResponseEntity<String> handleBookingNotFoundException(
                        BookingNotFoundException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(PaymentNotFoundException.class)
        public ResponseEntity<String> handlePaymentNotFoundException(
                        PaymentNotFoundException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(PaymentAlreadyExistsException.class)
        public ResponseEntity<String> handlePaymentAlreadyExistsException(
                        PaymentAlreadyExistsException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.CONFLICT);
        }

        @ExceptionHandler(PaymentFailedException.class)
        public ResponseEntity<String> handlePaymentFailedException(
                        PaymentFailedException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(RoomAlreadyBookedException.class)
        public ResponseEntity<String> handleRoomAlreadyBooked(
                        RoomAlreadyBookedException ex) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ex.getMessage());
        }

        @ExceptionHandler(RoomCapacityExceededException.class)
        public ResponseEntity<String> handleCapacity(
                        RoomCapacityExceededException ex) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ex.getMessage());
        }

        @ExceptionHandler(InvalidBookingDatesException.class)
        public ResponseEntity<String> handleInvalidDates(
                        InvalidBookingDatesException ex) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ex.getMessage());
        }

        @ExceptionHandler(DuplicateBookingException.class)
        public ResponseEntity<String> handleDuplicateBooking(
                        DuplicateBookingException ex) {

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(ex.getMessage());
        }
}