package com.delivery.user.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String token;
    private String type = "Bearer";
    private UserDto user;
}