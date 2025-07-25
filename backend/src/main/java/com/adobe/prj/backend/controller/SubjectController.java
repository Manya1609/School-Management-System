package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.request.SubjectRequestDTO;
import com.adobe.prj.backend.dto.response.SubjectResponseDTO;
import com.adobe.prj.backend.entity.Subject;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @PostMapping
    public ResponseEntity<SubjectResponseDTO> createSubject(@RequestBody SubjectRequestDTO subjectRequestDTO) throws ResourceNotFoundException {
        SubjectResponseDTO createdSubject = subjectService.createSubject(subjectRequestDTO);
        return ResponseEntity.ok(createdSubject);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> getSubjectById(@PathVariable int id) throws ResourceNotFoundException {
        SubjectResponseDTO subject = subjectService.getSubjectById(id);
        return ResponseEntity.ok(subject);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<SubjectResponseDTO>> getSubjectsByUserId(@PathVariable int userId) throws AccessDeniedException, ResourceNotFoundException {
        List<SubjectResponseDTO> subjectsByUser = subjectService.getSubjectsForUser(userId);
        return ResponseEntity.ok(subjectsByUser);
    }

    @GetMapping("/{classes}/{classId}")
    public ResponseEntity<List<SubjectResponseDTO>> getSubjectsByClassId(@PathVariable int classId) {
        List<SubjectResponseDTO> subjectResponseDTOList = subjectService.getAllByClass(classId);
        return new ResponseEntity<>(subjectResponseDTOList,HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<SubjectResponseDTO>> getAllSubjects() {
        List<SubjectResponseDTO> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> updateSubject(@PathVariable int id, @RequestBody SubjectRequestDTO subjectRequestDTO) throws ResourceNotFoundException {
        SubjectResponseDTO updatedSubject = subjectService.updateSubject(id, subjectRequestDTO);
        return ResponseEntity.ok(updatedSubject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable int id) throws ResourceNotFoundException {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

}
