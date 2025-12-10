package com.delivery.order.service;

import lombok.Data;

import java.util.Set;

@Data
public class RestaurantDto {
    private Long id;
    private String name;
    private String cuisine;
    private String address;
    private Set<DishDto> dishes;
}
