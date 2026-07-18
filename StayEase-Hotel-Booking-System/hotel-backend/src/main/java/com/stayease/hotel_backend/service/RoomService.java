package com.stayease.hotel_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.stayease.hotel_backend.dto.room.RoomRequestDTO;
import com.stayease.hotel_backend.dto.room.RoomResponseDTO;
import com.stayease.hotel_backend.dto.room.RoomSearchRequestDTO;
import com.stayease.hotel_backend.entity.Room;
import com.stayease.hotel_backend.entity.RoomType;
import com.stayease.hotel_backend.enums.BookingStatus;
import com.stayease.hotel_backend.exception.RoomNotFoundException;
import com.stayease.hotel_backend.repository.BookingRepository;
import com.stayease.hotel_backend.repository.RoomRepository;
import com.stayease.hotel_backend.repository.RoomTypeRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingRepository bookingRepository;

    // =========================
    // DTO MAPPING
    // =========================

    private RoomResponseDTO mapToResponseDTO(Room room) {

        RoomResponseDTO dto = new RoomResponseDTO();

        dto.setId(room.getId());
        dto.setRoomNumber(room.getRoomNumber());
        dto.setRoomType(room.getRoomType().getName());
        dto.setPricePerNight(room.getRoomType().getPricePerNight());
        dto.setCapacity(room.getCapacity());
        dto.setImageUrl(room.getImageUrl());
        dto.setDescription(resolveDescription(room));

        return dto;
    }

    private String resolveDescription(Room room) {

        if (room.getDescription() != null && !room.getDescription().isBlank()) {
            return room.getDescription();
        }

        return "A well-appointed " + room.getRoomType().getName()
                + " room comfortably sleeping up to " + room.getCapacity()
                + " guest" + (room.getCapacity() == 1 ? "" : "s") + ".";
    }

    private Room mapToEntity(RoomRequestDTO dto) {

        Room room = new Room();

        RoomType roomType = roomTypeRepository
                .findByName(dto.getRoomType())
                .orElseThrow(() -> new RuntimeException("Room Type not found"));

        room.setRoomType(roomType);
        room.setCapacity(dto.getCapacity());
        room.setImageUrl(dto.getImageUrl());
        room.setDescription(dto.getDescription());

        return room;
    }

    // =========================
    // ROOM NUMBER GENERATOR
    // =========================

    private String generateRoomNumber(RoomType roomType) {

        String prefix = roomType.getPrefix();

        Room lastRoom = roomRepository
                .findTopByRoomTypeOrderByRoomNumberDesc(roomType);

        if (lastRoom == null) {
            return prefix + "101";
        }

        String lastNumber = lastRoom.getRoomNumber();

        int number = Integer.parseInt(lastNumber.substring(prefix.length()));

        number++;

        return prefix + number;
    }

    // =========================
    // CRUD
    // =========================

    // Rooms that don't have a currently-active booking (BOOKED or CHECKED_IN).
    // A room becomes available again once its booking is CHECKED_OUT or CANCELLED.
    private static final List<BookingStatus> ACTIVE_BOOKING_STATUSES =
            List.of(BookingStatus.BOOKED, BookingStatus.CHECKED_IN);

    public List<RoomResponseDTO> getAvailableRooms() {

        return roomRepository.findAll()
                .stream()
                .filter(room -> !bookingRepository
                        .existsByRoomAndBookingStatusIn(room, ACTIVE_BOOKING_STATUSES))
                .map(this::mapToResponseDTO)
                .toList();
    }

    public List<RoomResponseDTO> getAllRooms() {

        return roomRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public RoomResponseDTO saveRoom(RoomRequestDTO dto) {

        Room room = mapToEntity(dto);

        room.setRoomNumber(generateRoomNumber(room.getRoomType()));

        Room savedRoom = roomRepository.save(room);

        return mapToResponseDTO(savedRoom);
    }

    public RoomResponseDTO getRoomById(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));

        return mapToResponseDTO(room);
    }

    public RoomResponseDTO updateRoom(Long id, RoomRequestDTO dto) {

        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));

        RoomType roomType = roomTypeRepository
                .findByName(dto.getRoomType())
                .orElseThrow(() -> new RuntimeException("Room Type not found"));

        existingRoom.setRoomType(roomType);
        existingRoom.setCapacity(dto.getCapacity());
        existingRoom.setImageUrl(dto.getImageUrl());
        existingRoom.setDescription(dto.getDescription());

        Room updatedRoom = roomRepository.save(existingRoom);

        return mapToResponseDTO(updatedRoom);
    }

    public void deleteRoom(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));

        roomRepository.delete(room);
    }

    public List<RoomResponseDTO> searchAvailableRooms(
            RoomSearchRequestDTO dto) {

        List<Room> rooms = roomRepository
                .findByRoomType_NameIgnoreCaseAndCapacityGreaterThanEqual(
                        dto.getRoomType().trim(),
                        dto.getGuests());

        return rooms.stream()

                .filter(room -> !bookingRepository
                        .existsByRoomIdAndBookingStatusNotAndCheckInDateLessThanAndCheckOutDateGreaterThan(
                                room.getId(),
                                BookingStatus.CANCELLED,
                                dto.getCheckOutDate(),
                                dto.getCheckInDate()))

                .map(this::mapToResponseDTO)

                .toList();
    }
}