package com.delivery.restaurant.mapper;

import com.delivery.restaurant.dto.request.RestaurantRequestDto;
import com.delivery.restaurant.dto.response.RestaurantResponseDto;
import com.delivery.restaurant.entity.Restaurant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RestaurantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dishes", ignore = true)
    Restaurant toEntity(RestaurantRequestDto dto);

    RestaurantResponseDto toDto(Restaurant restaurant);
}