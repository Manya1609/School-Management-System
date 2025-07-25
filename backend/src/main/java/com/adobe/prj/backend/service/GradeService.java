package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.request.GradeRequestDTO;
import com.adobe.prj.backend.dto.response.GradeResponseDTO;
import com.adobe.prj.backend.entity.Grade;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.GradeMapper;
import com.adobe.prj.backend.repository.GradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradeService {
    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private GradeMapper gradeMapper;

    public GradeResponseDTO createGrade(GradeRequestDTO gradeRequestDTO) {
        Grade grade = gradeMapper.toEntity(gradeRequestDTO);
        grade = gradeRepository.save(grade);
        return gradeMapper.toDto(grade);
    }

    public List<GradeResponseDTO> getAllGrades() {
       return gradeRepository.findAll()
                .stream()
                .map(gradeMapper::toDto)
                .collect(Collectors.toList());
    }

    public GradeResponseDTO updateGrade(int id, GradeRequestDTO gradeRequestDTO) throws ResourceNotFoundException {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));

        grade.setGrade_name(gradeRequestDTO.getGradeName());
        grade.setGrade_type(gradeRequestDTO.getGradeType());
        grade.setMark_from(gradeRequestDTO.getMarkFrom());
        grade.setMark_to(gradeRequestDTO.getMarkTo());
        grade.setGrade_remark(gradeRequestDTO.getGradeRemark());

        grade = gradeRepository.save(grade);
        return gradeMapper.toDto(grade);
    }

    public void deleteGrade(int id) throws ResourceNotFoundException {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found"));
        gradeRepository.delete(grade);
    }
}

