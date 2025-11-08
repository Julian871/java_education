package com.delivery.restaurant.controller;

import com.delivery.restaurant.dto.request.RestaurantRequestDto;
import com.delivery.restaurant.dto.response.RestaurantResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
public class RestaurantPublicController {


    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public RestaurantResponseDto register(@Valid @RequestBody RestaurantRequestDto restaurantRequest) {
        return null;
    }
}