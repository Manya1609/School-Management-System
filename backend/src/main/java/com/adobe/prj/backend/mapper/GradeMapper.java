package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.request.GradeRequestDTO;
import com.adobe.prj.backend.dto.response.GradeResponseDTO;
import com.adobe.prj.backend.entity.Grade;
import org.springframework.stereotype.Component;

@Component
public class GradeMapper {
    public Grade toEntity(GradeRequestDTO dto) {
        Grade grade = new Grade();
        grade.setGrade_name(dto.getGradeName());
        grade.setGrade_type(dto.getGradeType());
        grade.setMark_from(dto.getMarkFrom());
        grade.setMark_to(dto.getMarkTo());
        grade.setGrade_remark(dto.getGradeRemark());
        return grade;
    }

    public GradeResponseDTO toDto(Grade entity) {
        GradeResponseDTO dto = new GradeResponseDTO();
        dto.setGradeId(entity.getGrade_id());
        dto.setGradeName(entity.getGrade_name());
        dto.setGradeType(entity.getGrade_type());
        dto.setGradeRange(entity.getMark_from() + "-" + entity.getMark_to());
        dto.setGradeRemark(entity.getGrade_remark());
        return dto;
    }
}
