package com.stayease.hotel_backend.dto.room;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoomRequestDTO {

    @NotBlank(message = "Room type is required")
    private String roomType;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be greater than zero")
    @Max(value = 2, message = "A room can sleep at most 2 guests")
    private Integer capacity;


    private String imageUrl;

    @Size(max = 300, message = "Description cannot exceed 300 characters")
    private String description;
}