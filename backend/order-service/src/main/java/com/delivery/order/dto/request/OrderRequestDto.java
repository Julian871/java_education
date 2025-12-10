package com.delivery.order.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequestDto {

    @NotNull(message = "Restaurant ID is required")
    @Positive(message = "Restaurant ID must be a positive number")
    private Long restaurantId;

    @NotEmpty(message = "Order items cannot be empty")
    @Valid
    private List<OrderItemRequestDto> orderItems;

    @NotNull(message = "Payment method is required")
    @NotBlank(message = "Payment method is required")
    @Pattern(
            regexp = "^(CARD|CASH|PAYPAL)$",
            message = "Payment method must be CARD, CASH or PAYPAL"
    )
    private String paymentMethod;
}