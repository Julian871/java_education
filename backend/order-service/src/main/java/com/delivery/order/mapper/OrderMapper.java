package com.delivery.order.mapper;

import com.delivery.order.dto.request.OrderRequestDto;
import com.delivery.order.dto.response.OrderResponseDto;
import com.delivery.order.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "payment", ignore = true)
    Order toEntity(OrderRequestDto orderRequestDto);

    OrderResponseDto toDto(Order order);
    List<OrderResponseDto> toDtoList(List<Order> orders);
}