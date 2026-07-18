package com.stayease.hotel_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stayease.hotel_backend.dto.roomtype.RoomTypeRequestDTO;
import com.stayease.hotel_backend.dto.roomtype.RoomTypeResponseDTO;
import com.stayease.hotel_backend.service.RoomTypeService;

import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/room-types")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<RoomTypeResponseDTO> createRoomType(
            @Valid @RequestBody RoomTypeRequestDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roomTypeService.saveRoomType(dto));
    }

    @GetMapping
    public ResponseEntity<List<RoomTypeResponseDTO>> getAllRoomTypes() {

        return ResponseEntity.ok(roomTypeService.getAllRoomTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomTypeResponseDTO> getRoomTypeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(roomTypeService.getRoomTypeById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RoomTypeResponseDTO> updateRoomType(
            @PathVariable Long id,
            @Valid @RequestBody RoomTypeRequestDTO dto) {

        return ResponseEntity.ok(
                roomTypeService.updateRoomType(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoomType(
            @PathVariable Long id) {

        roomTypeService.deleteRoomType(id);

        return ResponseEntity.noContent().build();
    }
}
