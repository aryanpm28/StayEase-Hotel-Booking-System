package com.stayease.hotel_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.stayease.hotel_backend.entity.RoomType;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    Optional<RoomType> findByName(String name);

    boolean existsByName(String name);
}