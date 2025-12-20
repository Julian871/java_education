package com.delivery.order.controller;

import com.delivery.order.dto.request.OrderRequestDto;
import com.delivery.order.dto.response.OrderResponseDto;
import com.delivery.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Order controller", description = "Orders manage")
public class OrderController {

    private final OrderService orderService;

    @Operation(
            summary = "New order **HAS ROLE USER**",
            description = "Create new order",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Created",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data or validation error",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Restaurant with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponseDto createOrder(@Valid @RequestBody OrderRequestDto orderRequestDto) {
        long userId = (long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return orderService.createOrder(orderRequestDto, userId);
    }

    @Operation(
            summary = "Get **HAS ROLE USER | ADMIN**",
            description = "Get orders",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Success",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @GetMapping("")
    @ResponseStatus(HttpStatus.OK)
    public List<OrderResponseDto> getOrders(HttpServletRequest request) {
        return orderService.getOrders(request);
    }

    @Operation(
            summary = "Get",
            description = "Get order by id",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Success",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Order with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public OrderResponseDto getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @Operation(
            summary = "Get **HAS ROLE ADMIN**",
            description = "Get user order by id",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Success",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = OrderResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<OrderResponseDto> getOrdersByUserId(@PathVariable Long id) {
        return orderService.getOrdersByUserId(id);
    }

    @Operation(
            summary = "Update **HAS ROLE ADMIN**",
            description = "Update order status by id",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Order with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @PatchMapping("/{orderId}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        orderService.updateOrderStatus(orderId, status);
    }
}
