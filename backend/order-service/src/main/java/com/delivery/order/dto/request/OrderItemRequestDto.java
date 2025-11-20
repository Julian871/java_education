package com.delivery.order.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class OrderItemRequestDto {

    @NotNull(message = "Dish ID is required")
    @Positive(message = "Dish ID must be positive")
    private Long dishId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Integer price;
}