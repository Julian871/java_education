package com.delivery.order.service;

import com.delivery.order.dto.request.OrderRequestDto;
import com.delivery.order.dto.response.OrderResponseDto;
import com.delivery.order.entity.Order;
import com.delivery.order.entity.OrderItem;
import com.delivery.order.entity.Payment;
import com.delivery.order.exception.ApiException;
import com.delivery.order.mapper.OrderMapper;
import com.delivery.order.repository.OrderItemRepository;
import com.delivery.order.repository.OrderRepository;
import com.delivery.order.repository.PaymentRepository;
import com.delivery.order.util.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;
    private final PaymentRepository paymentRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto orderRequestDto, Long userId) {


        Integer totalPrice = orderRequestDto.getOrderItems().stream()
                .mapToInt(item -> item.getPrice() * item.getQuantity())
                .sum();

        Order order = new Order();
        order.setStatus("PLACED");
        order.setUserId(userId);
        order.setRestaurantId(orderRequestDto.getRestaurantId());
        order.setTotalPrice(totalPrice);

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = orderRequestDto.getOrderItems().stream()
                .map(itemDto -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrder);
                    orderItem.setDishId(itemDto.getDishId());
                    orderItem.setQuantity(itemDto.getQuantity());
                    orderItem.setPrice(itemDto.getPrice());
                    return orderItem;
                })
                .collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);
        savedOrder.setOrderItems(orderItems);

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setMethod(orderRequestDto.getPaymentMethod());
        payment.setAmount(totalPrice);
        payment.setStatus("PAID");

        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        //kafkaTemplate.send("order-created", createOrderCreatedEvent(savedOrder));

        return orderMapper.toDto(savedOrder);
    }

    private Object createOrderCreatedEvent(Order order) {
        return new Object() {
            public final String eventType = "ORDER_CREATED";
            public final Long orderId = order.getId();
            public final Long userId = order.getUserId();
            public final Long restaurantId = order.getRestaurantId();
            public final String status = order.getStatus();
            public final Integer totalAmount = order.getTotalPrice();
            public final LocalDateTime createdAt = order.getOrderDate();
        };
    }

    public List<OrderResponseDto> getOrders(HttpServletRequest request) {
        String token = jwtTokenProvider.getTokenFromRequest(request);
        List<String> roles = jwtTokenProvider.getRolesFromToken(token);
        Long userId = jwtTokenProvider.getUserIdFromToken(token);

        List<Order> orders;

        if(roles.contains("ADMIN")) {
            orders = orderRepository.findAll();
        } else {
            orders = orderRepository.getOrdersByUserId(userId);
        }

        return orders.stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());

    }

    public OrderResponseDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found", HttpStatus.NOT_FOUND));

        return orderMapper.toDto(order);
    }

    public void updateOrderStatus(Long orderId, String status) {
        validateStatus(status);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ApiException("Order not found", HttpStatus.NOT_FOUND));

        order.setStatus(status);
        orderRepository.save(order);
    }

    private void validateStatus(String status) {
        List<String> validStatuses = List.of("PLACED", "COOKING", "READY", "DELIVERED", "CANCELLED");
        if (!validStatuses.contains(status)) {
            throw new ApiException("Invalid order status", HttpStatus.BAD_REQUEST);
        }
    }
}
