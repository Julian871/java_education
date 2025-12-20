package com.delivery.user.controller;

import com.delivery.user.dto.request.UpdateUserRequestDto;
import com.delivery.user.dto.response.AuthResponseDto;
import com.delivery.user.dto.response.UserResponseDto;
import com.delivery.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "User controller", description = "Actions with user")
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Current user",
            description = "Get information about current user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get current user",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto getCurrentUser() {
        long userId = (long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.getCurrentUser(userId);
    }

    @Operation(
            summary = "Get all users **HAS ROLE: ADMIN**",
            description = "Get information about all users",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get users",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public List<UserResponseDto> getUsers() {
        return userService.getUsers();
    }


    @Operation(
            summary = "Get user by id **HAS ROLE: ADMIN**",
            description = "Get information about user by id",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Get user",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto getUserById(@PathVariable Long id) {
        return userService.getCurrentUser(id);
    }

    @Operation(
            summary = "Update current user",
            description = "Update information about current user",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Success update",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data or validation error",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @ResponseStatus(HttpStatus.OK)
    public UserResponseDto updateUser(@Valid @RequestBody UpdateUserRequestDto updateUserRequestDto) {
        long userId = (long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.updateUserProfile(userId, updateUserRequestDto);
    }

    @Operation(
            summary = "Delete user by id **HAS ROLE: ADMIN**",
            description = "Delete user by id",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Delete user",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "User unauthorized",
                    content = @Content(schema = @Schema(hidden = true))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User with this id not found",
                    content = @Content(schema = @Schema(hidden = true))
            )
    })
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