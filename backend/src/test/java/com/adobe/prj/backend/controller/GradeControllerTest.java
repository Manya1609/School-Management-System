package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.request.GradeRequestDTO;
import com.adobe.prj.backend.dto.response.GradeResponseDTO;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.GradeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class GradeControllerTest {
    @Mock
    private GradeService gradeService;

    @InjectMocks
    private GradeController gradeController;

    private GradeRequestDTO gradeRequestDTO;
    private GradeResponseDTO gradeResponseDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        gradeRequestDTO = new GradeRequestDTO();
        gradeRequestDTO.setGradeName("A");
        gradeRequestDTO.setGradeType("Percentage");
        gradeRequestDTO.setMarkFrom(90);
        gradeRequestDTO.setMarkTo(100);
        gradeRequestDTO.setGradeRemark("Excellent");

        gradeResponseDTO = new GradeResponseDTO();
        gradeResponseDTO.setGradeId(1);
        gradeResponseDTO.setGradeName("A");
        gradeResponseDTO.setGradeType("Percentage");
        gradeResponseDTO.setGradeRange("90-100");
        gradeResponseDTO.setGradeRemark("Excellent");
    }

    @Test
    void testCreateGrade() {
        when(gradeService.createGrade(any(GradeRequestDTO.class))).thenReturn(gradeResponseDTO);

        ResponseEntity<GradeResponseDTO> response = gradeController.createGrade(gradeRequestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(gradeResponseDTO, response.getBody());
    }

    @Test
    void testGetAllGrades() {
        List<GradeResponseDTO> gradeList = Arrays.asList(gradeResponseDTO);
        when(gradeService.getAllGrades()).thenReturn(gradeList);

        ResponseEntity<List<GradeResponseDTO>> response = gradeController.getAllGrades();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(gradeList, response.getBody());
    }

    @Test
    void testUpdateGrade() throws ResourceNotFoundException {
        when(gradeService.updateGrade(eq(1), any(GradeRequestDTO.class))).thenReturn(gradeResponseDTO);

        ResponseEntity<GradeResponseDTO> response = gradeController.updateGrade(1, gradeRequestDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(gradeResponseDTO, response.getBody());
    }

    @Test
    void testDeleteGrade() throws ResourceNotFoundException {
        doNothing().when(gradeService).deleteGrade(1);

        ResponseEntity<Void> response = gradeController.deleteGrade(1);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(gradeService, times(1)).deleteGrade(1);
    }
}
