package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.exam.ExamDTO;
import com.adobe.prj.backend.service.ExamService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
public class ExamControllerTest {

    @InjectMocks
    private ExamController examController;

    @Mock
    private ExamService examService;

    private ExamDTO examDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        examDTO = new ExamDTO();
        examDTO.setId(1);
        examDTO.setName("Mid Term");
        examDTO.setTerm("Term 1");
    }
    @Test
    public void testCreateExam() {
        when(examService.create(any(ExamDTO.class))).thenReturn(examDTO);

        ResponseEntity<ExamDTO> response = examController.createExam(examDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(examDTO, response.getBody());
        verify(examService, times(1)).create(any(ExamDTO.class));
    }

    @Test
    public void testGetAllExams() {
        List<ExamDTO> examDTOList = Arrays.asList(examDTO);

        when(examService.getAll()).thenReturn(examDTOList);

        ResponseEntity<List<ExamDTO>> response = examController.getAllExams();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(examService, times(1)).getAll();
    }

    @Test
    public void testUpdateExam() {
        when(examService.update(anyInt(), any(ExamDTO.class))).thenReturn(examDTO);

        ResponseEntity<ExamDTO> response = examController.updateExam(1, examDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(examDTO, response.getBody());
        verify(examService, times(1)).update(anyInt(), any(ExamDTO.class));
    }

    @Test
    public void testDeleteExam() {
        doNothing().when(examService).delete(anyInt());

        ResponseEntity<ExamDTO> response = examController.deleteExam(1);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(examService, times(1)).delete(anyInt());
    }

}
