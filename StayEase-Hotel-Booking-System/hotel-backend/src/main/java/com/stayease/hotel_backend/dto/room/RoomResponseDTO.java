package com.stayease.hotel_backend.dto.room;

import lombok.Data;

@Data
public class RoomResponseDTO {

    private Long id;
    private String roomNumber;
    private String roomType;
    private Double pricePerNight;
    private Integer capacity;

    private String imageUrl;
    private String description;

}