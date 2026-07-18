package com.stayease.hotel_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.stayease.hotel_backend.dto.room.RoomRequestDTO;
import com.stayease.hotel_backend.dto.room.RoomResponseDTO;
import com.stayease.hotel_backend.service.RoomService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.stayease.hotel_backend.dto.room.RoomSearchRequestDTO;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // Authenticated Users
    @GetMapping
    public ResponseEntity<List<RoomResponseDTO>> getAllRooms() {

        return ResponseEntity.ok(roomService.getAllRooms());

    }

    // Public browsing — excludes rooms that are currently booked/checked-in
    @GetMapping("/available")
    public ResponseEntity<List<RoomResponseDTO>> getAvailableRooms() {

        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @PostMapping("/search")
    public ResponseEntity<List<RoomResponseDTO>> searchRooms(
            @Valid @RequestBody RoomSearchRequestDTO dto) {

        return ResponseEntity.ok(
                roomService.searchAvailableRooms(dto));
    }

    // ADMIN Only
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<RoomResponseDTO> addRoom(
            @Valid @RequestBody RoomRequestDTO roomRequestDTO) {

        RoomResponseDTO room = roomService.saveRoom(roomRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    // Authenticated Users
    @GetMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> getRoomById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                roomService.getRoomById(id));

    }

    // ADMIN Only
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequestDTO roomRequestDTO) {

        RoomResponseDTO updatedRoom = roomService.updateRoom(id, roomRequestDTO);

        return ResponseEntity.ok(updatedRoom);
    }

    // ADMIN Only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable Long id) {

        roomService.deleteRoom(id);

        return ResponseEntity.noContent().build();

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/test")
    public ResponseEntity<String> testValidation(
            @Valid @RequestBody RoomRequestDTO dto) {

        return ResponseEntity.ok("Validation Passed");
    }
}