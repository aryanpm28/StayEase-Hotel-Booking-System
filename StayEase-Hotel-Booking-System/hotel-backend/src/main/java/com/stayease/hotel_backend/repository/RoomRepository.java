package com.stayease.hotel_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stayease.hotel_backend.entity.Room;
import com.stayease.hotel_backend.entity.RoomType;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Room findTopByRoomTypeOrderByRoomNumberDesc(RoomType roomType);

    List<Room> findByRoomType_NameIgnoreCaseAndCapacityGreaterThanEqual(
            String roomType,
            Integer capacity);

}