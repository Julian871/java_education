package com.delivery.user.dto.response;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
}