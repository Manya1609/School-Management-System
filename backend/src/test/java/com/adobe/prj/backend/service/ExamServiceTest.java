package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.exam.ExamDTO;
import com.adobe.prj.backend.entity.Exam;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.ExamMapper;
import com.adobe.prj.backend.repository.ExamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
public class ExamServiceTest {

    @InjectMocks
    private ExamService examService;

    @Mock
    private ExamRepository examRepository;

    @Mock
    private ExamMapper examMapper;

    private Exam exam;
    private ExamDTO examDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        exam = new Exam();
        exam.setExam_id(1);
        exam.setName("Mid Term");
        exam.setTerm("Term 1");

        examDTO = new ExamDTO();
        examDTO.setId(1);
        examDTO.setName("Mid Term");
        examDTO.setTerm("Term 1");
    }


    @Test
    public void testCreateExam() {
        when(examMapper.toEntity(any(ExamDTO.class))).thenReturn(exam);
        when(examRepository.save(any(Exam.class))).thenReturn(exam);
        when(examMapper.toDTO(any(Exam.class))).thenReturn(examDTO);

        ExamDTO createdExam = examService.create(examDTO);

        assertNotNull(createdExam);
        assertEquals("Mid Term", createdExam.getName());
        verify(examRepository, times(1)).save(any(Exam.class));
    }

    @Test
    public void testGetAllExams() {
        List<Exam> examList = Arrays.asList(exam);
        List<ExamDTO> examDTOList = Arrays.asList(examDTO);

        when(examRepository.findAll()).thenReturn(examList);
        when(examMapper.toDTO(any(Exam.class))).thenReturn(examDTO);

        List<ExamDTO> result = examService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(examRepository, times(1)).findAll();
    }
    @Test
    public void testUpdateExam() {
        when(examRepository.findById(anyInt())).thenReturn(Optional.of(exam));
        when(examRepository.save(any(Exam.class))).thenReturn(exam);
        when(examMapper.toDTO(any(Exam.class))).thenReturn(examDTO);

        ExamDTO updatedExam = examService.update(1, examDTO);

        assertNotNull(updatedExam);
        assertEquals("Mid Term", updatedExam.getName());
        verify(examRepository, times(1)).findById(anyInt());
        verify(examRepository, times(1)).save(any(Exam.class));
    }

    @Test
    public void testUpdateExam_NotFound() {
        when(examRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> examService.update(1, examDTO));

        verify(examRepository, times(1)).findById(anyInt());
        verify(examRepository, never()).save(any(Exam.class));
    }

    @Test
    public void testDeleteExam() {
        when(examRepository.findById(anyInt())).thenReturn(Optional.of(exam));
        doNothing().when(examRepository).deleteById(anyInt());

        examService.delete(1);

        verify(examRepository, times(1)).deleteById(anyInt());
    }
}
