package com.delivery.restaurant.controller;

import com.delivery.restaurant.dto.request.RestaurantRequestDto;
import com.delivery.restaurant.dto.response.RestaurantResponseDto;
import com.delivery.restaurant.service.RestaurantAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/restaurants")
@RequiredArgsConstructor
public class RestaurantAdminController {

    private final RestaurantAdminService restaurantAdminService;

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public RestaurantResponseDto createRestaurant(@Valid @RequestBody RestaurantRequestDto restaurantRequest) {
        return restaurantAdminService.createRestaurant(restaurantRequest);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantResponseDto updateRestaurant(@PathVariable Long id,
                                                  @Valid @RequestBody RestaurantRequestDto restaurantRequest ) {
        return restaurantAdminService.updateRestaurant(restaurantRequest, id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRestaurant(@PathVariable Long id) {
        restaurantAdminService.deleteRestaurant(id);
    }
}