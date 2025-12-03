package com.delivery.user.controller;

import com.delivery.user.dto.request.UpdateUserRequestDto;
import com.delivery.user.dto.response.UserResponseDto;
import com.delivery.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto getCurrentUser() {
        long userId = (long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.getCurrentUser(userId);
    }

    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<UserResponseDto> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto getUserById(@PathVariable Long id) {
        return userService.getCurrentUser(id);
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto updateUser(@Valid @RequestBody UpdateUserRequestDto updateUserRequestDto) {
        long userId = (long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.updateUserProfile(userId, updateUserRequestDto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PutMapping("/admin/role/{id}")
    @PreAuthorize("hasRole('USER')")
    @ResponseStatus(HttpStatus.OK)
    public void giveAdminRole(@PathVariable Long id) {
        userService.updateRole(id);
    }

}