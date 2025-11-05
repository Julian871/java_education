package com.delivery.user.mapper;

import com.delivery.user.dto.UserDto;
import com.delivery.user.dto.AddressDto;
import com.delivery.user.dto.RoleDto;
import com.delivery.user.entity.User;
import com.delivery.user.entity.Address;
import com.delivery.user.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toDto(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Address toEntity(AddressDto addressDto);

    Set<AddressDto> toAddressDtoSet(Set<Address> addresses);

    RoleDto toDto(Role role);
}