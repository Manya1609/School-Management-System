package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.request.UserRequestDTO;
import com.adobe.prj.backend.dto.response.UserResponseDTO;
import com.adobe.prj.backend.dto.response.UserRoleListDTO;
import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.entity.Admin;
import com.adobe.prj.backend.entity.Teacher;
import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.exceptions.InvalidRoleException;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.UserMapper;
import com.adobe.prj.backend.repository.TeacherRepository;
import com.adobe.prj.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserMapper userMapper;



    public UserResponseDTO getUserById(int id) throws ResourceNotFoundException {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    public UserResponseDTO createUser(UserRequestDTO dto) {
        User user = userMapper.toEntity(dto);
        user = userRepository.save(user); // Save the User first to get the generated ID

        UserRole role = UserRole.fromString(dto.getRole());
        if (role == UserRole.TEACHER) {
            Teacher teacher = new Teacher();
            teacher.setUser(user); // Associate the created user with the teacher
            teacherRepository.save(teacher); // Save the Teacher entity
        }

        return userMapper.toDto(user);
    }

    public UserResponseDTO updateUser(int id, UserResponseDTO dto) throws ResourceNotFoundException {
        Optional<User> existingUserOpt = userRepository.findById(id);

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            // Update the existing user's fields with the new values
            existingUser.setRole(UserRole.fromString(dto.getRole()));
            existingUser.setFullName(dto.getFullName());
            existingUser.setAddress(dto.getAddress());
            existingUser.setEmail(dto.getEmail());
            existingUser.setUserName(dto.getUsername());
            existingUser.setPhone(dto.getPhone());
            existingUser.setTelephone(dto.getTelephone());
            existingUser.setDateOfEmployment(dto.getDateOfEmployment());
            existingUser.setGender(dto.getGender());
            existingUser.setNationality(dto.getNationality());
            existingUser.setState(dto.getState());
            existingUser.setLga(dto.getLga());
            existingUser.setBloodGroup(dto.getBloodGroup());
            existingUser.setDob(dto.getDob());

            // Save the updated entity
            User updatedUser = userRepository.save(existingUser);


            // Update Teacher entity if the role is TEACHER
            if (UserRole.TEACHER == updatedUser.getRole()) {
                Optional<Teacher> existingTeacherOptional = teacherRepository.findByUser(existingUserOpt);
                if (existingTeacherOptional.isPresent()) {
                    Teacher teacher = existingTeacherOptional.get();
                    teacher.setUser(updatedUser);
                    teacherRepository.save(teacher);
                } else {
                    Teacher teacher = new Teacher();
                    teacher.setUser(updatedUser);
                    teacherRepository.save(teacher);
                }
            } else {
                // If the role is not TEACHER, remove from Teacher table if present
                Optional<Teacher> teacherOptional = teacherRepository.findByUser(existingUserOpt);
                if (teacherOptional.isPresent()) {
                    teacherRepository.delete(teacherOptional.get());
                }
            }

            return userMapper.toDto(updatedUser);
        } else {
            throw new ResourceNotFoundException("User not found");
        }
    }


    @Transactional
    public void deleteUser(int id){
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            // Deleting the User will automatically delete the associated Teacher due to cascade
            userRepository.deleteById(id);
        }
    }


    // Method to get list of users by role
    public List<UserRoleListDTO> getUsersByRole(String role) {
        UserRole userRole = UserRole.fromString(role);

        if (userRole == null) {
            throw new InvalidRoleException("Invalid role: " + role);
        }

        Optional<List<User>> users = userRepository.findByRole(userRole);
        return users.orElse(Collections.emptyList()).stream()
                .map(userMapper::toRoleListDto)
                .collect(Collectors.toList());
    }


    public UserResponseDTO getUserByTeacherId(int teacherId) throws ResourceNotFoundException {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + teacherId));

        User user = teacher.getUser();

        return userMapper.toDto(user);
    }

}
