package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.request.GradeRequestDTO;
import com.adobe.prj.backend.dto.response.GradeResponseDTO;
import com.adobe.prj.backend.entity.Grade;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.GradeMapper;
import com.adobe.prj.backend.repository.GradeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class GradeServiceTest {
    @Mock
    private GradeRepository gradeRepository;

    @Mock
    private GradeMapper gradeMapper;

    @InjectMocks
    private GradeService gradeService;

    private Grade grade;
    private GradeRequestDTO gradeRequestDTO;
    private GradeResponseDTO gradeResponseDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        grade = new Grade();
        grade.setGrade_id(1);
        grade.setGrade_name("A");
        grade.setGrade_type("Percentage");
        grade.setMark_from(90);
        grade.setMark_to(100);
        grade.setGrade_remark("Excellent");

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
        when(gradeMapper.toEntity(any(GradeRequestDTO.class))).thenReturn(grade);
        when(gradeRepository.save(any(Grade.class))).thenReturn(grade);
        when(gradeMapper.toDto(any(Grade.class))).thenReturn(gradeResponseDTO);

        GradeResponseDTO result = gradeService.createGrade(gradeRequestDTO);

        assertEquals(gradeResponseDTO, result);
        verify(gradeRepository, times(1)).save(grade);
    }

    @Test
    void testGetAllGrades() {
        List<Grade> gradeList = Arrays.asList(grade);
        List<GradeResponseDTO> gradeResponseList = Arrays.asList(gradeResponseDTO);

        when(gradeRepository.findAll()).thenReturn(gradeList);
        when(gradeMapper.toDto(any(Grade.class))).thenReturn(gradeResponseDTO);

        List<GradeResponseDTO> result = gradeService.getAllGrades();

        assertEquals(gradeResponseList.size(), result.size());
        verify(gradeRepository, times(1)).findAll();
    }

    @Test
    void testUpdateGrade() throws ResourceNotFoundException {
        when(gradeRepository.findById(1)).thenReturn(Optional.of(grade));
        when(gradeRepository.save(any(Grade.class))).thenReturn(grade);
        when(gradeMapper.toDto(any(Grade.class))).thenReturn(gradeResponseDTO);

        GradeResponseDTO result = gradeService.updateGrade(1, gradeRequestDTO);

        assertEquals(gradeResponseDTO, result);
        verify(gradeRepository, times(1)).save(grade);
    }

    @Test
    void testDeleteGrade() throws ResourceNotFoundException {
        when(gradeRepository.findById(1)).thenReturn(Optional.of(grade));

        gradeService.deleteGrade(1);

        verify(gradeRepository, times(1)).delete(grade);
    }

    @Test
    void testUpdateGrade_ResourceNotFoundException() {
        when(gradeRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            gradeService.updateGrade(1, gradeRequestDTO);
        });
    }

    @Test
    void testDeleteGrade_ResourceNotFoundException() {
        when(gradeRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            gradeService.deleteGrade(1);
        });
    }
}
