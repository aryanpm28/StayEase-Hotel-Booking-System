package com.stayease.hotel_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.stayease.hotel_backend.dto.roomtype.RoomTypeRequestDTO;
import com.stayease.hotel_backend.dto.roomtype.RoomTypeResponseDTO;
import com.stayease.hotel_backend.entity.RoomType;
import com.stayease.hotel_backend.exception.RoomTypeAlreadyExistsException;
import com.stayease.hotel_backend.exception.RoomTypeNotFoundException;
import com.stayease.hotel_backend.repository.RoomTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    private RoomTypeResponseDTO mapToResponseDTO(RoomType roomType) {

        RoomTypeResponseDTO dto = new RoomTypeResponseDTO();

        dto.setId(roomType.getId());
        dto.setName(roomType.getName());
        dto.setPricePerNight(roomType.getPricePerNight());
        dto.setPrefix(roomType.getPrefix());

        return dto;
    }

    private RoomType mapToEntity(RoomTypeRequestDTO dto) {

        RoomType roomType = new RoomType();

        roomType.setName(dto.getName());
        roomType.setPricePerNight(dto.getPricePerNight());
        roomType.setPrefix(dto.getPrefix());

        return roomType;
    }

    public RoomTypeResponseDTO saveRoomType(RoomTypeRequestDTO dto) {

        if (roomTypeRepository.existsByName(dto.getName())) {
            throw new RoomTypeAlreadyExistsException(dto.getName());
        }

        RoomType roomType = mapToEntity(dto);

        RoomType saved = roomTypeRepository.save(roomType);

        return mapToResponseDTO(saved);
    }

    public List<RoomTypeResponseDTO> getAllRoomTypes() {

        return roomTypeRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public RoomTypeResponseDTO getRoomTypeById(Long id) {

        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException(id));

        return mapToResponseDTO(roomType);
    }

    public RoomTypeResponseDTO updateRoomType(Long id,
            RoomTypeRequestDTO dto) {

        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException(id));

        roomType.setName(dto.getName());
        roomType.setPricePerNight(dto.getPricePerNight());
        roomType.setPrefix(dto.getPrefix());

        RoomType updated = roomTypeRepository.save(roomType);

        return mapToResponseDTO(updated);
    }

    public void deleteRoomType(Long id) {

        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RoomTypeNotFoundException(id));

        roomTypeRepository.delete(roomType);
    }
}