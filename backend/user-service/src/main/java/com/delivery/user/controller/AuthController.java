package com.delivery.user.controller;

import com.delivery.user.dto.response.AuthResponseDto;
import com.delivery.user.dto.request.LoginRequestDto;
import com.delivery.user.dto.request.RegisterRequestDto;
import com.delivery.user.dto.response.RegisterResponseDto;
import com.delivery.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponseDto register(@Valid @RequestBody RegisterRequestDto registerRequest) {
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public AuthResponseDto login(@Valid @RequestBody LoginRequestDto loginRequest) {
        return authService.login(loginRequest);
    }
}