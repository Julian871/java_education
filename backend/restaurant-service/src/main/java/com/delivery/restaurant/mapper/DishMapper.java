package com.delivery.restaurant.mapper;

import com.delivery.restaurant.dto.request.DishRequestDto;
import com.delivery.restaurant.dto.response.DishResponseDto;
import com.delivery.restaurant.entity.Dish;
import com.delivery.restaurant.entity.Restaurant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface DishMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurant", source = "restaurantId", qualifiedByName = "mapRestaurantIdToRestaurant")
    Dish toEntity(DishRequestDto dto);

    DishResponseDto toDto(Dish dish);

    @Named("mapRestaurantIdToRestaurant")
    default Restaurant mapRestaurantIdToRestaurant(Long restaurantId) {
        if (restaurantId == null) {
            return null;
        }
        Restaurant restaurant = new Restaurant();
        restaurant.setId(restaurantId);
        return restaurant;
    }
}