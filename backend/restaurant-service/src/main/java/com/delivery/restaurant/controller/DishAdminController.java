package com.delivery.restaurant.controller;

import com.delivery.restaurant.dto.request.DishRequestDto;
import com.delivery.restaurant.dto.response.DishResponseDto;
import com.delivery.restaurant.service.DishAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/admin/restaurants")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DishAdminController {

    private final DishAdminService dishAdminService;

    @PostMapping("/{restaurantId}/dishes")
    @ResponseStatus(HttpStatus.CREATED)
    public DishResponseDto createDish(@PathVariable Long restaurantId,
                                      @Valid @RequestBody DishRequestDto dishRequest) {
        return dishAdminService.createDish(dishRequest, restaurantId);
    }

    @PutMapping("/dishes/{id}")
    @ResponseStatus(HttpStatus.OK)
    public DishResponseDto updateDish(@PathVariable Long id,
                                      @Valid @RequestBody DishRequestDto dishRequest) {
        return dishAdminService.updateDish(dishRequest, id);
    }

    @DeleteMapping("/dishes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDish(@PathVariable Long id) {
        dishAdminService.deleteDish(id);
    }
}
