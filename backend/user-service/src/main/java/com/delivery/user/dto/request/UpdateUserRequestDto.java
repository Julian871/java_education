package com.delivery.user.dto.request;

import lombok.Data;

import java.util.Set;

@Data
public class UpdateUserRequestDto {
    private String fullName;
    private Set<AddressRequestDto> addresses;
}
