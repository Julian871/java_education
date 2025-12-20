package com.delivery.restaurant.controller;

import com.delivery.restaurant.dto.request.DishRequestDto;
import com.delivery.restaurant.dto.response.DishResponseDto;
import com.delivery.restaurant.service.DishAdminService;
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
@Tag(name = "Dish admin controller", description = "Admin manage dishes")
public class DishAdminController {

    private final DishAdminService dishAdminService;

    @Operation(
            summary = "New dish",
            description = "Create new dish",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Created",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DishResponseDto.class))
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
                    responseCode = "404",
                    description = "Restaurant with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Dish name already exists in this restaurant",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @PostMapping("/{restaurantId}/dishes")
    @ResponseStatus(HttpStatus.CREATED)
    public DishResponseDto createDish(@PathVariable Long restaurantId,
                                      @Valid @RequestBody DishRequestDto dishRequest) {
        return dishAdminService.createDish(dishRequest, restaurantId);
    }

    @Operation(
            summary = "Update",
            description = "Update dish by id",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Updated",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DishResponseDto.class))
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
                    description = "Dish with this name already exists",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @PutMapping("/dishes/{id}")
    @ResponseStatus(HttpStatus.OK)
    public DishResponseDto updateDish(@PathVariable Long id,
                                      @Valid @RequestBody DishRequestDto dishRequest) {
        return dishAdminService.updateDish(dishRequest, id);
    }

    @Operation(
            summary = "Delete",
            description = "Delete dish by id",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Delete dish",
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
                    description = "Dish with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @DeleteMapping("/dishes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDish(@PathVariable Long id) {
        dishAdminService.deleteDish(id);
    }
}
