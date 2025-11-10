package com.delivery.restaurant.repository;

import com.delivery.restaurant.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    boolean existsByNameAndRestaurantId(String name, Long restaurantId);

    boolean existsByNameAndIdNot(String name, Long id);

    List<Dish> findByRestaurantId(Long restaurantId);
}
