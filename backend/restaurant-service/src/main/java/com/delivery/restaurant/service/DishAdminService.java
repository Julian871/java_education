package com.delivery.restaurant.service;

import com.delivery.restaurant.dto.request.DishRequestDto;
import com.delivery.restaurant.dto.response.DishResponseDto;
import com.delivery.restaurant.entity.Dish;
import com.delivery.restaurant.entity.Restaurant;
import com.delivery.restaurant.exception.ApiException;
import com.delivery.restaurant.mapper.DishMapper;
import com.delivery.restaurant.repository.DishRepository;
import com.delivery.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DishAdminService {

    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;
    private final DishMapper dishMapper;

    public DishResponseDto createDish(DishRequestDto dishRequest, Long restaurantId) {
        if (dishRepository.existsByNameAndRestaurantId(dishRequest.getName(), restaurantId)) {
            throw new ApiException("Dish name already exists in this restaurant", HttpStatus.CONFLICT);
        }

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ApiException("Restaurant not found", HttpStatus.NOT_FOUND));

        Dish dish = dishMapper.toEntity(dishRequest);
        dish.setRestaurant(restaurant);

        Dish savedDish = dishRepository.save(dish);

        return dishMapper.toDto(savedDish);
    }

    public DishResponseDto updateDish(DishRequestDto dishRequest, Long dishId) {
        if(dishRepository.existsByNameAndIdNot(dishRequest.getName(), dishId)) {
            throw new ApiException("Name already exists", HttpStatus.CONFLICT);
        }

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ApiException("Dish not found", HttpStatus.NOT_FOUND));

        dish.setName(dishRequest.getName());
        dish.setPrice(dishRequest.getPrice());
        dish.setDescription(dishRequest.getDescription());
        dish.setImageUrl(dishRequest.getImageUrl());

        return dishMapper.toDto(dish);
    }

    public void deleteDish(Long id) {
        dishRepository.findById(id)
                .orElseThrow(() -> new ApiException("Dish not found", HttpStatus.NOT_FOUND));
        dishRepository.deleteById(id);
    }
}
