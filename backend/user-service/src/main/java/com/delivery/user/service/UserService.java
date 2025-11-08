package com.delivery.user.service;

import com.delivery.user.dto.response.UserResponseDto;
import com.delivery.user.entity.Address;
import com.delivery.user.entity.Role;
import com.delivery.user.entity.User;
import com.delivery.user.exception.ApiException;
import com.delivery.user.mapper.UserMapper;
import com.delivery.user.repository.RoleRepository;
import com.delivery.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    public UserResponseDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.toDto(user);
    }

    @Transactional
    public UserResponseDto updateUserProfile(Long userId, UserResponseDto userResponseDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        user.setFullName(userResponseDto.getFullName());

        if (userResponseDto.getAddresses() != null && !userResponseDto.getAddresses().isEmpty()) {
            user.getAddresses().clear();

            Set<Address> addresses = userResponseDto.getAddresses().stream()
                    .map(addressDto -> {
                        Address address = userMapper.toEntity(addressDto);
                        address.setUser(user);
                        return address;
                    })
                    .collect(Collectors.toSet());
            user.getAddresses().addAll(addresses);
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        userRepository.deleteById(userId);
    }

    @Transactional
    public void updateRole(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("ADMIN");
                    return roleRepository.save(newRole);
                });

        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }

        user.getRoles().add(adminRole);

        userRepository.save(user);
    }
}