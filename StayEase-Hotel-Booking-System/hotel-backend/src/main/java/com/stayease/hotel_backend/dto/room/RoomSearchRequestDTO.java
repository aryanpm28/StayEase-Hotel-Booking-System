package com.stayease.hotel_backend.dto.room;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RoomSearchRequestDTO {

    @NotBlank
    private String roomType;

    @NotNull
    @Future
    private LocalDate checkInDate;

    @NotNull
    @Future
    private LocalDate checkOutDate;

    @Positive
    private Integer guests;

}