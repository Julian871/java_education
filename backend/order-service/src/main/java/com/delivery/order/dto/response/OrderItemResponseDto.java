package com.delivery.order.dto.response;

import lombok.Data;

@Data
public class OrderItemResponseDto {
    private Long id;
    private Long dishId;
    private Integer quantity;
    private Integer price;
}
