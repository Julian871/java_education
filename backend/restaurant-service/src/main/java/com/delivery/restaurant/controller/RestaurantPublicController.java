package com.delivery.restaurant.controller;

import com.delivery.restaurant.dto.response.DishResponseDto;
import com.delivery.restaurant.dto.response.RestaurantResponseDto;
import com.delivery.restaurant.service.RestaurantPublicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurant controller", description = "User manage restaurants")
public class RestaurantPublicController {

    private final RestaurantPublicService restaurantPublicService;

    @Operation(
            summary = "Get restaurants"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get all restaurants",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RestaurantResponseDto.class))
            )
    })
    @GetMapping("")
    @ResponseStatus(HttpStatus.OK)
    public Page<RestaurantResponseDto> getRestaurants(
            @RequestParam(required = false) String cuisine,
            @RequestParam(defaultValue = "0") int page
    )

    {
        return restaurantPublicService.getRestaurants(cuisine, page);
    }

    @Operation(
            summary = "Get restaurant",
            description = "Get restaurant by id"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get all restaurants",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RestaurantResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Restaurant with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            ),
    })
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantResponseDto getRestaurant(@PathVariable Long id) {
        return restaurantPublicService.getRestaurant(id);
    }

    @Operation(
            summary = "Get dishes",
            description = "Get restaurant dishes"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get all restaurant dishes",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DishResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Restaurant with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            ),
    })
    @GetMapping("/{restaurantId}/dishes")
    @ResponseStatus(HttpStatus.OK)
    public List<DishResponseDto> getRestaurantDishes(@PathVariable Long restaurantId) {
        return restaurantPublicService.getDishesByRestaurantId(restaurantId);
    }
}