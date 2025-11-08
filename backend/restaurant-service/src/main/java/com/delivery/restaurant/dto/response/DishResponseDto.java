package com.delivery.restaurant.dto.response;

import lombok.Data;

@Data
public class DishResponseDto {
    private Long id;
    private String name;
    private String description;
    private Integer price;
    private String imageUrl;
}
