package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.request.UserRequestDTO;
import com.adobe.prj.backend.dto.response.UserResponseDTO;
import com.adobe.prj.backend.dto.response.UserRoleListDTO;
import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.entity.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequestDTO dto) {
        User user = new User();

        user.setRole(UserRole.fromString(dto.getRole()));;
        user.setFullName(dto.getFullName());
        user.setAddress(dto.getAddress());
        user.setEmail(dto.getEmail());
        user.setUserName(dto.getUsername());
        user.setPassword(new BCryptPasswordEncoder().encode(dto.getPassword()));
        user.setPhone(dto.getPhone());
        user.setTelephone(dto.getTelephone());
        user.setDateOfEmployment(dto.getDateOfEmployment());
        user.setGender(dto.getGender());
        user.setNationality(dto.getNationality());
        user.setState(dto.getState());
        user.setLga(dto.getLga());
        user.setBloodGroup(dto.getBloodGroup());
        user.setDob(dto.getDob());
//        user.setPhoto(dto.getPassportPhoto());
        return user;
    }

    public UserResponseDTO toDto(User entity) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(entity.getUserId());
        dto.setRole(entity.getRole() != null ? entity.getRole().getValue() : null);
        dto.setFullName(entity.getFullName());
        dto.setAddress(entity.getAddress());
        dto.setEmail(entity.getEmail());
        dto.setUsername(entity.getUserName());
        dto.setPhone(entity.getPhone());
        dto.setTelephone(entity.getTelephone());
        dto.setDateOfEmployment(entity.getDateOfEmployment());
        dto.setGender(entity.getGender());
        dto.setNationality(entity.getNationality());
        dto.setState(entity.getState());
        dto.setLga(entity.getLga());
        dto.setBloodGroup(entity.getBloodGroup());
        dto.setDob(entity.getDob());
        return dto;
    }

    public UserRoleListDTO toRoleListDto(User user) {
        UserRoleListDTO dto = new UserRoleListDTO();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        return dto;
    }

}
