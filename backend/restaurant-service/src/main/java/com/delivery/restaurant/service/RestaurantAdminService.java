package com.delivery.restaurant.service;

import com.delivery.restaurant.dto.request.RestaurantRequestDto;
import com.delivery.restaurant.dto.response.RestaurantResponseDto;
import com.delivery.restaurant.entity.Restaurant;
import com.delivery.restaurant.exception.ApiException;
import com.delivery.restaurant.mapper.RestaurantMapper;
import com.delivery.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantAdminService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantMapper restaurantMapper;

    public RestaurantResponseDto createRestaurant(RestaurantRequestDto restaurantRequest) {
        if(restaurantRepository.existsByName(restaurantRequest.getName())) {
            throw new ApiException("Name already exists", HttpStatus.CONFLICT);
        }

        Restaurant restaurant = restaurantMapper.toEntity(restaurantRequest);
        restaurant.setCuisine(restaurant.getCuisine().toLowerCase());

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return restaurantMapper.toDto(savedRestaurant);
    }

    public RestaurantResponseDto updateRestaurant(RestaurantRequestDto restaurantRequest, Long restaurantId) {

        if(restaurantRepository.existsByNameAndIdNot(restaurantRequest.getName(), restaurantId)) {
            throw new ApiException("Name already exists", HttpStatus.CONFLICT);
        }


        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ApiException("Restaurant not found", HttpStatus.NOT_FOUND));


        restaurant.setName(restaurantRequest.getName());
        restaurant.setCuisine(restaurantRequest.getCuisine().toLowerCase());
        restaurant.setAddress(restaurantRequest.getAddress());

        return restaurantMapper.toDto(restaurant);
    }

    public void deleteRestaurant(Long restaurantId) {
        restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ApiException("Restaurant not found", HttpStatus.NOT_FOUND));

        restaurantRepository.deleteById(restaurantId);
    }
}
