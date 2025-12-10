package com.delivery.user.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateUserRequestDto {
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 20)
    private String fullName;

    @Valid
    private Set<AddressRequestDto> addresses;
}
