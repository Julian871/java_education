package com.delivery.order.dto.response;

import lombok.Data;

@Data
public class PaymentResponseDto {
    private Long id;
    private String method;
    private Integer amount;
    private String status;
    private Long orderId;
}
