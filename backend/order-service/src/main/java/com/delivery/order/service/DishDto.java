package com.delivery.order.service;

import lombok.Data;

@Data
public class DishDto {
    private Long id;
    private String name;
    private String description;
    private Integer price;
    private String imageUrl;
}