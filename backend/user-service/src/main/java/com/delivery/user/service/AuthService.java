package com.delivery.user.service;

import com.delivery.user.dto.response.AuthResponseDto;
import com.delivery.user.dto.request.LoginRequestDto;
import com.delivery.user.dto.request.RegisterRequestDto;
import com.delivery.user.dto.response.RegisterResponseDto;
import com.delivery.user.entity.Address;
import com.delivery.user.entity.Role;
import com.delivery.user.entity.User;
import com.delivery.user.exception.ApiException;
import com.delivery.user.mapper.UserMapper;
import com.delivery.user.repository.UserRepository;
import com.delivery.user.repository.RoleRepository;
import com.delivery.user.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public RegisterResponseDto register(RegisterRequestDto registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT);
        }

        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("CUSTOMER");
                    return roleRepository.save(newRole);
                });

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setRoles(new HashSet<>(Set.of(customerRole)));

        if (registerRequest.getAddresses() != null && !registerRequest.getAddresses().isEmpty()) {
            Set<Address> addresses = registerRequest.getAddresses().stream()
                    .map(addressRequestDto -> {
                        Address address = userMapper.toEntity(addressRequestDto);
                        address.setUser(user);
                        return address;
                    })
                    .collect(Collectors.toSet());
            user.setAddresses(addresses);
        }

        User savedUser = userRepository.save(user);

        List<String> roles = savedUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String accessToken = jwtTokenProvider.generateAccessToken(savedUser.getId(), roles);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        RegisterResponseDto response = userMapper.toRegisterDto(savedUser);

        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        return response;
    }

    public AuthResponseDto login(LoginRequestDto loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new ApiException("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), roles);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        AuthResponseDto authResponse = new AuthResponseDto();
        authResponse.setAccessToken(accessToken);
        authResponse.setRefreshToken(refreshToken);

        return authResponse;
    }
}