package com.delivery.restaurant.dto.response;

import lombok.Data;

import java.util.Set;

@Data
public class RestaurantResponseDto {
    private Long id;
    private String name;
    private String cuisine;
    private String address;
    private Set<DishResponseDto> dishes;
}
