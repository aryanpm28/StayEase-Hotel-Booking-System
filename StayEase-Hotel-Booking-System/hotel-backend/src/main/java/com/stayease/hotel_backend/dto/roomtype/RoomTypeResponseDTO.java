package com.stayease.hotel_backend.dto.roomtype;

import lombok.Data;

@Data
public class RoomTypeResponseDTO {

    private Long id;
    private String name;
    private Double pricePerNight;
    private String prefix;
}