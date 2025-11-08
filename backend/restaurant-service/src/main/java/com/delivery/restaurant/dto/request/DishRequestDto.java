package com.delivery.restaurant.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class DishRequestDto {

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 20)
    private String name;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 50)
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Integer price;

    @NotBlank(message = "Image is required")
    @URL(message = "Image URL must be valid")
    private String imageUrl;

    @NotNull(message = "Restaurant is required")
    private Long restaurantId;
}
