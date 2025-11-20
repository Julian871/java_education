package com.delivery.order.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class OrderRequestDto {

    @NotNull(message = "Restaurant ID is required")
    @Positive(message = "Restaurant ID must be a positive number")
    private Long restaurantId;

    @NotEmpty(message = "Order items cannot be empty")
    private List<OrderItemRequestDto> orderItems;

    @NotNull(message = "Payment method is required")
    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}