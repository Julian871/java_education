package com.delivery.restaurant.repository;

import com.delivery.restaurant.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>,
        JpaSpecificationExecutor<Restaurant> {
    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);
}