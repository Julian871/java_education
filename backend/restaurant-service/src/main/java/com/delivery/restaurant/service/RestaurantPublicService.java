package com.delivery.restaurant.service;

import com.delivery.restaurant.dto.response.DishResponseDto;
import com.delivery.restaurant.dto.response.RestaurantResponseDto;
import com.delivery.restaurant.entity.Dish;
import com.delivery.restaurant.entity.Restaurant;
import com.delivery.restaurant.exception.ApiException;
import com.delivery.restaurant.mapper.DishMapper;
import com.delivery.restaurant.mapper.RestaurantMapper;
import com.delivery.restaurant.repository.DishRepository;
import com.delivery.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantPublicService {
    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;
    private final DishRepository dishRepository;
    private final DishMapper dishMapper;

    public Page<RestaurantResponseDto> getRestaurants(String cuisine, int page) {
        Pageable pageable = PageRequest.of(page, 20, Sort.by("name").ascending());

        if (cuisine != null && !cuisine.isBlank()) {
            return restaurantRepository
                    .findByCuisineContainingIgnoreCase(cuisine, pageable)
                    .map(restaurantMapper::toDto);
        }

        return restaurantRepository
                .findAll(pageable)
                .map(restaurantMapper::toDto);
    }

    public RestaurantResponseDto getRestaurant(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ApiException("Restaurant not found", HttpStatus.NOT_FOUND));

        return restaurantMapper.toDto(restaurant);
    }

    public List<DishResponseDto> getDishesByRestaurantId(Long id) {
        restaurantRepository.findById(id)
                .orElseThrow(() -> new ApiException("Restaurant not found", HttpStatus.NOT_FOUND));

        List<Dish> dishes = dishRepository.findByRestaurantId(id);

        return dishes.stream()
                .map(dishMapper::toDto)
                .collect(Collectors.toList());
    }
}
