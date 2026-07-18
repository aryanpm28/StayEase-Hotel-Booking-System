package com.stayease.hotel_backend.dto.roomtype;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class RoomTypeRequestDTO {

    @NotBlank(message = "Room type name is required")
    private String name;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than zero")
    private Double pricePerNight;

    @NotBlank(message = "Prefix is required")
    @Pattern(regexp = "^[A-Z]{1,3}$", message = "Prefix must be 1-3 uppercase letters, e.g. D, PR, SUI")
    private String prefix;
}