package com.delivery.user.mapper;

import com.delivery.user.dto.UserDto;
import com.delivery.user.dto.AddressDto;
import com.delivery.user.dto.RoleDto;
import com.delivery.user.entity.User;
import com.delivery.user.entity.Address;
import com.delivery.user.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDto toDto(User user);

    User toEntity(UserDto userDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateAddressFromDto(AddressDto addressDto, @MappingTarget Address address);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Address toEntity(AddressDto addressDto);

    Set<AddressDto> toAddressDtoSet(Set<Address> addresses);
    Set<Address> toAddressSet(Set<AddressDto> addressDtos);

    RoleDto toDto(Role role);
}