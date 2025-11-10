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
import org.springframework.data.jpa.domain.Specification;
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

    public List<RestaurantResponseDto> getRestaurants(String cuisine, Double minRating) {
        Specification<Restaurant> spec = Specification.where(null);

        if (cuisine != null && !cuisine.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("cuisine"), cuisine));
        }

        if (minRating != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("rating"), minRating));
        }

        List<Restaurant> restaurants = restaurantRepository.findAll(spec);

        return restaurants.stream()
                .map(restaurantMapper::toDto)
                .collect(Collectors.toList());
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
