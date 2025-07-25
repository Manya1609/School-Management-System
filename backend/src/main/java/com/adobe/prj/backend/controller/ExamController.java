package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.Class.ClassDTO;
import com.adobe.prj.backend.dto.exam.ExamDTO;
import com.adobe.prj.backend.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ExamController {
    @Autowired
    ExamService examService;


    @PostMapping("/exams")
    public ResponseEntity<ExamDTO> createExam(@RequestBody ExamDTO examDTO){
        ExamDTO examDTORes=examService.create(examDTO);
        return new ResponseEntity<>(examDTORes,HttpStatus.OK);
    }

    @GetMapping("/exams")
    public ResponseEntity<List<ExamDTO>> getAllExams(){
        List<ExamDTO> examDTOList = examService.getAll();
        return new ResponseEntity<>(examDTOList,HttpStatus.OK);
    }



    @PutMapping("/exams/{examId}")
    public ResponseEntity<ExamDTO> updateExam(@PathVariable int examId,@RequestBody ExamDTO examDTO){
        ExamDTO examDTORes=examService.update(examId,examDTO);
        return new ResponseEntity<>(examDTORes,HttpStatus.OK);
    }


    @DeleteMapping("/exams/{examId}")
    public ResponseEntity<ExamDTO> deleteExam(@PathVariable int examId){
        examService.delete(examId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
