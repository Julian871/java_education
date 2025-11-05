package com.delivery.user.controller;

import com.delivery.user.dto.AuthResponseDto;
import com.delivery.user.dto.LoginRequestDto;
import com.delivery.user.dto.RegisterRequestDto;
import com.delivery.user.dto.UserDto;
import com.delivery.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequestDto registerRequest) {
        UserDto userDto = authService.register(registerRequest);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        AuthResponseDto authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(authResponse);
    }
}