package com.delivery.order.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "restaurant-service", url = "${app.services.restaurant}")
public interface RestaurantServiceClient {

    @GetMapping("/restaurants/{id}")
    RestaurantDto getRestaurantById(@PathVariable Long id);
}