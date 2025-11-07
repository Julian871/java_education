package com.delivery.user.dto.response;

import com.delivery.user.dto.request.AddressRequestDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class RegisterResponseDto {

    private Long id;
    private String email;
    private String fullName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<AddressRequestDto> addresses;
    private String accessToken;
    private String refreshToken;
}
