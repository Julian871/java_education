package com.delivery.order.controller;

import com.delivery.order.dto.request.OrderRequestDto;
import com.delivery.order.dto.response.OrderResponseDto;
import com.delivery.order.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponseDto createOrder(@Valid @RequestBody OrderRequestDto orderRequestDto) {
        long userId = (long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return orderService.createOrder(orderRequestDto, userId);
    }

    @GetMapping("")
    @ResponseStatus(HttpStatus.OK)
    public List<OrderResponseDto> getOrders(HttpServletRequest request) {
        return orderService.getOrders(request);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public OrderResponseDto getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PatchMapping("/{orderId}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        orderService.updateOrderStatus(orderId, status);
    }
}
