package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.request.UserRequestDTO;
import com.adobe.prj.backend.dto.response.UserResponseDTO;
import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.UserMapper;
import com.adobe.prj.backend.repository.UserRepository;
import com.adobe.prj.backend.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserRequestDTO userRequestDTO;
    private UserResponseDTO userResponseDTO;

    @BeforeEach
    void setUp() {
        // Initialize Mockito annotations
        MockitoAnnotations.openMocks(this);

        // Create mock User object
        user = new User();
        user.setUserId(1);
        user.setFullName("John Doe");
        user.setEmail("john.doe@example.com");
        user.setRole(UserRole.SUPER_ADMIN);  // Assuming UserRole is an enum

        // Create mock DTOs
        userRequestDTO = new UserRequestDTO();
        userRequestDTO.setFullName("John Doe");
        userRequestDTO.setEmail("john.doe@example.com");

        userResponseDTO = new UserResponseDTO();
        userResponseDTO.setFullName("John Doe");
        userResponseDTO.setEmail("john.doe@example.com");
        userResponseDTO.setRole("SUPER_ADMIN");
    }

    @Test
    void testGetUserById_Success() throws ResourceNotFoundException {
        // Define the behavior of mocked objects
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userMapper.toDto(user)).thenReturn(userResponseDTO);

        // Call the method to test
        UserResponseDTO response = userService.getUserById(1);

        // Verify the result
        assertEquals("John Doe", response.getFullName());
        assertEquals("john.doe@example.com", response.getEmail());
        assertEquals("SUPER_ADMIN", response.getRole());

        // Verify that userRepository was called
        verify(userRepository, times(1)).findById(1);
    }

    @Test
    void testGetUserById_NotFound() {
        // Define the behavior for user not found
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        // Call the method and assert exception
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(1);
        });

        // Verify the method call
        verify(userRepository, times(1)).findById(1);
    }

    @Test
    void testCreateUser() {
        // Define behavior for repository save
        when(userMapper.toEntity(userRequestDTO)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userResponseDTO);

        // Call the method to test
        UserResponseDTO response = userService.createUser(userRequestDTO);

        // Assert the results
        assertEquals("John Doe", response.getFullName());
        assertEquals("john.doe@example.com", response.getEmail());
        assertEquals("SUPER_ADMIN", response.getRole());

        // Verify interactions
        verify(userRepository, times(1)).save(user);
    }
}
