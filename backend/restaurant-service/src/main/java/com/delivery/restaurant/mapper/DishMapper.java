package com.delivery.restaurant.mapper;

import com.delivery.restaurant.dto.request.DishRequestDto;
import com.delivery.restaurant.dto.response.DishResponseDto;
import com.delivery.restaurant.entity.Dish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DishMapper {

    @Mapping(target = "id", ignore = true)
    Dish toEntity(DishRequestDto dto);

    DishResponseDto toDto(Dish dish);
}