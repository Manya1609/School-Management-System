package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.exam.ExamDTO;
import com.adobe.prj.backend.entity.Exam;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
public class ExamMapper {


    public Exam toEntity(ExamDTO examDTO) {
        Exam exam = new Exam();
        exam.setExam_id(examDTO.getId());
        exam.setTerm(examDTO.getTerm());
        exam.setName(examDTO.getName());
        return exam;
    }
    public ExamDTO toDTO(Exam exam) {
        ExamDTO examDTO = new ExamDTO();
        examDTO.setTerm(exam.getTerm());
        examDTO.setName(exam.getName());
        examDTO.setId(exam.getExam_id());
        return examDTO;
    }
}
