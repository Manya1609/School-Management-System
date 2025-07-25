package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.request.SystemSettingsRequestDTO;
import com.adobe.prj.backend.dto.response.StatisticsResponseDTO;
import com.adobe.prj.backend.dto.response.SystemSettingsResponseDTO;
import com.adobe.prj.backend.entity.SystemSettings;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.SystemSettingsMapper;
import com.adobe.prj.backend.repository.ClassRepository;
import com.adobe.prj.backend.repository.SystemSettingsRepository;
import com.adobe.prj.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
public class SystemSettingsServiceTest {

    @InjectMocks
    private SystemSettingsService systemSettingsService;

    @Mock
    private SystemSettingsRepository systemSettingsRepository;

    @Mock
    private SystemSettingsMapper systemSettingsMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ClassRepository classRepository;

    private SystemSettings systemSettings;
    private SystemSettingsRequestDTO requestDTO;
    private SystemSettingsResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        systemSettings = new SystemSettings();
        systemSettings.setId(1);
        systemSettings.setNameOfSchool("Test School");

        requestDTO = new SystemSettingsRequestDTO();
        requestDTO.setNameOfSchool("Test School");

        responseDTO = new SystemSettingsResponseDTO();
        responseDTO.setId(1);
        responseDTO.setNameOfSchool("Test School");
    }


    @Test
    void createSystemSettings() {
        when(systemSettingsMapper.toEntity(any())).thenReturn(systemSettings);
        when(systemSettingsRepository.save(any())).thenReturn(systemSettings);
        when(systemSettingsMapper.toDTO(any())).thenReturn(responseDTO);

        SystemSettingsResponseDTO result = systemSettingsService.createSystemSettings(requestDTO);

        assertNotNull(result);
        assertEquals("Test School", result.getNameOfSchool());
        verify(systemSettingsRepository, times(1)).save(any(SystemSettings.class));
    }

    @Test
    void getSystemSettings() throws ResourceNotFoundException {
        when(systemSettingsRepository.findFirstByOrderByIdDesc()).thenReturn(Optional.of(systemSettings));
        when(systemSettingsMapper.toDTO(any())).thenReturn(responseDTO);

        SystemSettingsResponseDTO result = systemSettingsService.getSystemSettings();

        assertNotNull(result);
        assertEquals("Test School", result.getNameOfSchool());
        verify(systemSettingsRepository, times(1)).findFirstByOrderByIdDesc();
    }

    @Test
    void getSystemSettings_NotFound() {
        when(systemSettingsRepository.findFirstByOrderByIdDesc()).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> systemSettingsService.getSystemSettings());
    }

    @Test
    void updateSystemSettings() throws ResourceNotFoundException {
        when(systemSettingsRepository.findById(1)).thenReturn(Optional.of(systemSettings));
        when(systemSettingsRepository.save(any())).thenReturn(systemSettings);
        when(systemSettingsMapper.toDTO(any())).thenReturn(responseDTO);

        SystemSettingsResponseDTO result = systemSettingsService.updateSystemSettings(1, requestDTO);

        assertNotNull(result);
        assertEquals("Test School", result.getNameOfSchool());
        verify(systemSettingsRepository, times(1)).save(any(SystemSettings.class));
    }

    @Test
    void updateSystemSettings_NotFound() {
        when(systemSettingsRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> systemSettingsService.updateSystemSettings(1, requestDTO));
    }

    @Test
    void getSiteStatistics() {
        when(userRepository.countStudents()).thenReturn(100L);
        when(userRepository.countTeachers()).thenReturn(10L);
        when(userRepository.countAdmins()).thenReturn(5L);
        when(classRepository.countClasses()).thenReturn(20L);

        StatisticsResponseDTO stats = systemSettingsService.getSiteStatistics();

        assertNotNull(stats);
        assertEquals(100, stats.getStudentsCount());
        assertEquals(10, stats.getTeachersCount());
        assertEquals(5, stats.getAdminsCount());
        assertEquals(20, stats.getClassesCount());
    }
}
