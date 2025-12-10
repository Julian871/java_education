package com.delivery.user.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class RegisterRequestDto {
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 20)
    private String password;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 20)
    private String fullName;

    @Valid
    private Set<AddressRequestDto> addresses;
}