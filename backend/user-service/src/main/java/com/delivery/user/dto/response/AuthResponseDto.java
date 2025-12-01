package com.delivery.user.dto.response;

import com.delivery.user.entity.Role;
import lombok.Data;

import java.util.Set;

@Data
public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
    private Set<Role> roles;
    private String fullName;
}