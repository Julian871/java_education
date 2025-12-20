package com.delivery.restaurant.controller;

import com.delivery.restaurant.dto.request.RestaurantRequestDto;
import com.delivery.restaurant.dto.response.RestaurantResponseDto;
import com.delivery.restaurant.service.RestaurantAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/restaurants")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Restaurant admin controller", description = "Admin manage restaurants")
public class RestaurantAdminController {

    private final RestaurantAdminService restaurantAdminService;

    @Operation(
            summary = "New restaurant",
            description = "Create new restaurant",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Created",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RestaurantResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data or validation error",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Restaurant with this name already exists",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public RestaurantResponseDto createRestaurant(@Valid @RequestBody RestaurantRequestDto restaurantRequest) {
        return restaurantAdminService.createRestaurant(restaurantRequest);
    }

    @Operation(
            summary = "Update",
            description = "Update restaurant by id",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Updated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = RestaurantResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data or validation error",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Restaurant with this name already exists",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestaurantResponseDto updateRestaurant(@PathVariable Long id,
                                                  @Valid @RequestBody RestaurantRequestDto restaurantRequest ) {
        return restaurantAdminService.updateRestaurant(restaurantRequest, id);
    }

    @Operation(
            summary = "Delete",
            description = "Delete restaurant by id",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Delete restaurant",
                    content = @Content(
                            schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Restaurant with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRestaurant(@PathVariable Long id) {
        restaurantAdminService.deleteRestaurant(id);
    }
}