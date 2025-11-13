package com.delivery.restaurant.controller;

import com.delivery.restaurant.dto.response.DishResponseDto;
import com.delivery.restaurant.dto.response.RestaurantResponseDto;
import com.delivery.restaurant.service.RestaurantPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantPublicController {

    private final RestaurantPublicService restaurantPublicService;

    @GetMapping("")
    @ResponseStatus(HttpStatus.OK)
    public List<RestaurantResponseDto> getRestaurants(@RequestParam(required = false) String cuisine,
                                                      @RequestParam(required = false) Double rating) {
        return restaurantPublicService.getRestaurants(cuisine.toLowerCase(), rating);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantResponseDto getRestaurant(@PathVariable Long id) {
        return restaurantPublicService.getRestaurant(id);
    }

    @GetMapping("/{restaurantId}/dishes")
    @ResponseStatus(HttpStatus.OK)
    public List<DishResponseDto> getRestaurantDishes(@PathVariable Long restaurantId) {
        return restaurantPublicService.getDishesByRestaurantId(restaurantId);
    }
}