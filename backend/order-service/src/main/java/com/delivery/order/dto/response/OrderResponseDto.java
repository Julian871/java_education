package com.delivery.order.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDto {
    private Long id;
    private String status;
    private LocalDateTime orderDate;
    private Integer userId;
    private Integer restaurantId;
    private Integer totalPrice;
    private List<OrderItemResponseDto> orderItems;
    private PaymentResponseDto payment;
}
