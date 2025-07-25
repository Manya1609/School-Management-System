package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.Class.ClassDTO;
import com.adobe.prj.backend.dto.exam.ExamDTO;
import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.entity.Exam;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.ExamMapper;
import com.adobe.prj.backend.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamService {
    @Autowired
    ExamRepository examRepository;
    @Autowired
    ExamMapper examMapper;

    public ExamDTO create(ExamDTO examDTO) {
        Exam exam=examRepository.save(examMapper.toEntity(examDTO));
        return examMapper.toDTO(exam);
    }

    public List<ExamDTO> getAll() {
        return examRepository.findAll().stream().map(examMapper::toDTO).collect(Collectors.toList());
    }

    public ExamDTO update(int examId,ExamDTO examDTO) {

        Optional<Exam> existingExamOpt = examRepository.findById(examId);

        if (existingExamOpt.isPresent()) {
            Exam exam = existingExamOpt.get();

            exam.setTerm(examDTO.getTerm());
            exam.setName(examDTO.getName());

            Exam updatedExam= examRepository.save(exam);

            return examMapper.toDTO(updatedExam);
        } else {
            throw new ResourceNotFoundException("Exam not found");
        }
    }

    public void delete(int examId) {
        examRepository.deleteById(examId);
    }


}
