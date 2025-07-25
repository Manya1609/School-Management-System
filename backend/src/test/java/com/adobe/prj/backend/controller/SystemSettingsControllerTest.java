package com.adobe.prj.backend.controller;


import com.adobe.prj.backend.dto.request.SystemSettingsRequestDTO;
import com.adobe.prj.backend.dto.response.StatisticsResponseDTO;
import com.adobe.prj.backend.dto.response.SystemSettingsResponseDTO;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.SystemSettingsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
public class SystemSettingsControllerTest {

    @Mock
    private SystemSettingsService systemSettingsService;  // Mock the SystemSettingsService dependency

    @InjectMocks
    private SystemSettingsController systemSettingsController;  // Inject the mock into the controller

    private SystemSettingsResponseDTO systemSettingsResponseDTO;
    private SystemSettingsRequestDTO systemSettingsRequestDTO;

    @BeforeEach
    void setUp() {
        // Initialize the mock objects
        MockitoAnnotations.openMocks(this);

        // Create a mock SystemSettingsResponseDTO
        systemSettingsResponseDTO = new SystemSettingsResponseDTO();
        systemSettingsResponseDTO.setId(1);
        systemSettingsResponseDTO.setNameOfSchool("Test School");
        systemSettingsResponseDTO.setCurrentSession("2024/2025");
        systemSettingsResponseDTO.setSchoolEmail("test@school.com");


        // Create a mock SystemSettingsRequestDTO
        systemSettingsRequestDTO = new SystemSettingsRequestDTO();
        systemSettingsRequestDTO.setNameOfSchool("Test School");
        systemSettingsRequestDTO.setCurrentSession("2024/2025");
        systemSettingsRequestDTO.setSchoolEmail("test@school.com");

    }

    @Test
    void testCreateSystemSettings_Success() {
        // Mock the behavior of systemSettingsService
        when(systemSettingsService.createSystemSettings(systemSettingsRequestDTO)).thenReturn(systemSettingsResponseDTO);

        // Call the method to test
        ResponseEntity<SystemSettingsResponseDTO> response = systemSettingsController.createSystemSettings(systemSettingsRequestDTO);

        // Assert the results
        assertEquals(201, response.getStatusCodeValue());
        assertEquals("Test School", response.getBody().getNameOfSchool());

        // Verify interactions with the mocked service
        verify(systemSettingsService, times(1)).createSystemSettings(systemSettingsRequestDTO);
    }

    @Test
    void testGetSystemSettings_Success() throws ResourceNotFoundException {
        // Mock the behavior of systemSettingsService
        when(systemSettingsService.getSystemSettings()).thenReturn(systemSettingsResponseDTO);

        // Call the method to test
        ResponseEntity<SystemSettingsResponseDTO> response = systemSettingsController.getSystemSettings();

        // Assert the results
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Test School", response.getBody().getNameOfSchool());

        // Verify interactions with the mocked service
        verify(systemSettingsService, times(1)).getSystemSettings();
    }

    @Test
    void testGetSystemSettings_NotFound() throws ResourceNotFoundException {
        // Mock the behavior of systemSettingsService to throw an exception
        when(systemSettingsService.getSystemSettings()).thenThrow(new ResourceNotFoundException("Settings not found"));

        // Call the method and assert exception handling
        assertThrows(ResourceNotFoundException.class, () -> {
            systemSettingsController.getSystemSettings();
        });

        // Verify the interaction
        verify(systemSettingsService, times(1)).getSystemSettings();
    }

    @Test
    void testUpdateSystemSettings_Success() throws ResourceNotFoundException {
        // Mock the behavior of systemSettingsService
        when(systemSettingsService.updateSystemSettings(1, systemSettingsRequestDTO)).thenReturn(systemSettingsResponseDTO);

        // Call the method to test
        ResponseEntity<SystemSettingsResponseDTO> response = systemSettingsController.updateSystemSettings(1, systemSettingsRequestDTO);

        // Assert the results
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Test School", response.getBody().getNameOfSchool());

        // Verify interactions with the mocked service
        verify(systemSettingsService, times(1)).updateSystemSettings(1, systemSettingsRequestDTO);
    }

    @Test
    void testUpdateSystemSettings_NotFound() throws ResourceNotFoundException {
        // Mock the behavior of systemSettingsService to throw an exception
        when(systemSettingsService.updateSystemSettings(1, systemSettingsRequestDTO)).thenThrow(new ResourceNotFoundException("Settings not found"));

        // Call the method and assert exception handling
        assertThrows(ResourceNotFoundException.class, () -> {
            systemSettingsController.updateSystemSettings(1, systemSettingsRequestDTO);
        });

        // Verify the interaction
        verify(systemSettingsService, times(1)).updateSystemSettings(1, systemSettingsRequestDTO);
    }

    @Test
    void testGetSiteStatistics_Success() {
        // Mock the behavior of systemSettingsService
        StatisticsResponseDTO statisticsResponseDTO = new StatisticsResponseDTO();
        statisticsResponseDTO.setStudentsCount(100);
        statisticsResponseDTO.setTeachersCount(20);
        statisticsResponseDTO.setAdminsCount(5);
        statisticsResponseDTO.setClassesCount(10);

        when(systemSettingsService.getSiteStatistics()).thenReturn(statisticsResponseDTO);

        // Call the method to test
        ResponseEntity<StatisticsResponseDTO> response = systemSettingsController.getSiteStatistics();

        // Assert the results
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(100, response.getBody().getStudentsCount());

        // Verify interactions with the mocked service
        verify(systemSettingsService, times(1)).getSiteStatistics();
    }

}
