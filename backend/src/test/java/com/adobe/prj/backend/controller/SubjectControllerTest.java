package com.adobe.prj.backend.controller;


import com.adobe.prj.backend.dto.request.SubjectRequestDTO;
import com.adobe.prj.backend.dto.response.SubjectResponseDTO;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.SubjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class SubjectControllerTest {

    @Mock
    private SubjectService subjectService;  // Mock the SubjectService dependency

    @InjectMocks
    private SubjectController subjectController;  // Inject the mock into the controller

    private SubjectResponseDTO subjectResponseDTO;
    private SubjectRequestDTO subjectRequestDTO;

    @BeforeEach
    void setUp() {
        // Initialize the mock objects
        MockitoAnnotations.openMocks(this);

        // Create a mock SubjectResponseDTO
        subjectResponseDTO = new SubjectResponseDTO();
        subjectResponseDTO.setSubjectId(1);
        subjectResponseDTO.setSubjectName("Mathematics");
        subjectResponseDTO.setShortName("Math");

        // Create a mock SubjectRequestDTO
        subjectRequestDTO = new SubjectRequestDTO();
        subjectRequestDTO.setSubjectName("Mathematics");
        subjectRequestDTO.setShortName("Math");
    }

    @Test
    void testCreateSubject_Success() {
        // Mock the behavior of subjectService
        when(subjectService.createSubject(subjectRequestDTO)).thenReturn(subjectResponseDTO);

        // Call the method to test
        ResponseEntity<SubjectResponseDTO> response = subjectController.createSubject(subjectRequestDTO);

        // Assert the results
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Mathematics", response.getBody().getSubjectName());

        // Verify interactions with the mocked service
        verify(subjectService, times(1)).createSubject(subjectRequestDTO);
    }

    @Test
    void testGetSubject_Success() throws ResourceNotFoundException {
        // Mock the behavior of subjectService
        when(subjectService.getSubjectById(1)).thenReturn(subjectResponseDTO);

        // Call the method to test
        ResponseEntity<SubjectResponseDTO> response = subjectController.getSubjectById(1);

        // Assert the results
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Mathematics", response.getBody().getSubjectName());

        // Verify interactions with the mocked service
        verify(subjectService, times(1)).getSubjectById(1);
    }

    @Test
    void testGetSubject_NotFound() throws ResourceNotFoundException {
        // Mock the behavior of subjectService to throw an exception
        when(subjectService.getSubjectById(1)).thenThrow(new ResourceNotFoundException("Subject not found"));

        // Call the method and assert exception handling
        assertThrows(ResourceNotFoundException.class, () -> {
            subjectController.getSubjectById(1);
        });

        // Verify the interaction
        verify(subjectService, times(1)).getSubjectById(1);
    }

    @Test
    void testUpdateSubject_Success() throws ResourceNotFoundException {
        // Mock the behavior of subjectService
        when(subjectService.updateSubject(1, subjectRequestDTO)).thenReturn(subjectResponseDTO);

        // Call the method to test
        ResponseEntity<SubjectResponseDTO> response = subjectController.updateSubject(1, subjectRequestDTO);

        // Assert the results
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Mathematics", response.getBody().getSubjectName());

        // Verify interactions with the mocked service
        verify(subjectService, times(1)).updateSubject(1, subjectRequestDTO);
    }

    @Test
    void testUpdateSubject_NotFound() throws ResourceNotFoundException {
        // Mock the behavior of subjectService to throw an exception
        when(subjectService.updateSubject(1, subjectRequestDTO)).thenThrow(new ResourceNotFoundException("Subject not found"));

        // Call the method and assert exception handling
        assertThrows(ResourceNotFoundException.class, () -> {
            subjectController.updateSubject(1, subjectRequestDTO);
        });

        // Verify the interaction
        verify(subjectService, times(1)).updateSubject(1, subjectRequestDTO);
    }
}
