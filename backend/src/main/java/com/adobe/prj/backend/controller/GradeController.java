package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.request.GradeRequestDTO;
import com.adobe.prj.backend.dto.response.GradeResponseDTO;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    @PostMapping
    public ResponseEntity<GradeResponseDTO> createGrade(@RequestBody GradeRequestDTO gradeRequestDTO) {
        GradeResponseDTO responseDTO = gradeService.createGrade(gradeRequestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }



    @GetMapping
    public ResponseEntity<List<GradeResponseDTO>> getAllGrades() {
        List<GradeResponseDTO> grades = gradeService.getAllGrades();
        return new ResponseEntity<>(grades, HttpStatus.OK);
    }

    @PutMapping("/{grade_id}")
    public ResponseEntity<GradeResponseDTO> updateGrade(@PathVariable("grade_id") int id,
                                                        @RequestBody GradeRequestDTO gradeRequestDTO) throws ResourceNotFoundException {
        GradeResponseDTO responseDTO = gradeService.updateGrade(id, gradeRequestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{grade_id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable("grade_id") int id) throws ResourceNotFoundException {
        gradeService.deleteGrade(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

