package com.delivery.restaurant.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RestaurantRequestDto {

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 20)
    private String name;

    @NotBlank(message = "Cuisine is required")
    @Size(min = 3, max = 20)
    private String cuisine;

    @NotBlank(message = "Address is required")
    @Size(min = 10, max = 50)
    private String address;
}
