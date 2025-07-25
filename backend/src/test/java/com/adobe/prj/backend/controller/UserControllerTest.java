package com.adobe.prj.backend.controller;


import com.adobe.prj.backend.dto.response.UserResponseDTO;
import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
public class UserControllerTest {

    @Mock
    private UserService userService;  // Mock the UserService dependency

    @InjectMocks
    private UserController userController;  // Inject the mock into the controller

    private UserResponseDTO userResponseDTO;


    @BeforeEach
    void setUp() {
        // Initialize the mock objects
        MockitoAnnotations.openMocks(this);

        // Create a mock UserResponseDTO
        userResponseDTO = new UserResponseDTO();
        userResponseDTO.setFullName("John Doe");
        userResponseDTO.setEmail("john.doe@example.com");
        userResponseDTO.setRole("SUPER_ADMIN");
    }

    @Test
    void testGetUserById_Success() throws ResourceNotFoundException {
        // Mock the behavior of userService
        when(userService.getUserById(1)).thenReturn(userResponseDTO);

        // Call the method to test

        ResponseEntity<UserResponseDTO> response = userController.getUserById(1);

        // Assert the results
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("John Doe", response.getBody().getFullName());
        assertEquals("john.doe@example.com", response.getBody().getEmail());

        // Verify interactions with the mocked service
        verify(userService, times(1)).getUserById(1);
    }

    @Test
    void testGetUserById_NotFound() throws ResourceNotFoundException {
        // Mock the behavior of userService to throw an exception
        when(userService.getUserById(1)).thenThrow(new ResourceNotFoundException("User not found"));

        // Call the method and assert exception handling
        assertThrows(ResourceNotFoundException.class, () -> {
            userController.getUserById(1);
        });

        // Verify the interaction
        verify(userService, times(1)).getUserById(1);
    }

}
