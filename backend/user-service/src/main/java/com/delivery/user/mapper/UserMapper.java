package com.delivery.user.mapper;

import com.delivery.user.dto.response.RegisterResponseDto;
import com.delivery.user.dto.response.UserResponseDto;
import com.delivery.user.dto.request.AddressRequestDto;
import com.delivery.user.entity.User;
import com.delivery.user.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;


@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "accessToken", ignore = true)
    @Mapping(target = "refreshToken", ignore = true)
    @Mapping(target = "addresses", source = "addresses")
    RegisterResponseDto toRegisterDto(User user);

    Set<AddressRequestDto> toAddressDtoSet(Set<Address> addresses);

    AddressRequestDto toAddressDto(Address address);

    List<UserResponseDto> toDtoList(List<User> users);

    UserResponseDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Address toEntity(AddressRequestDto addressRequestDto);
}