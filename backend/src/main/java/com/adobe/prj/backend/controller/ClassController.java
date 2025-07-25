package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.Class.ClassDTO;
import com.adobe.prj.backend.dto.section.SectionDTO;
import com.adobe.prj.backend.dto.student.StudentDTO;
import com.adobe.prj.backend.service.ClassService;
import com.adobe.prj.backend.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    ClassService classService;
    @Autowired
    private SectionService sectionService;

    @PostMapping
    public ResponseEntity<ClassDTO> createClass(@RequestBody ClassDTO classDTO){
        ClassDTO classDto=classService.create(classDTO);
        return new ResponseEntity<>(classDto,HttpStatus.OK);
    }

    @PutMapping("/{classId}")
    public ResponseEntity<ClassDTO> updateClass(@PathVariable int classId,@RequestBody ClassDTO classDTO){
       ClassDTO classDtoRes= classService.update(classId,classDTO);
        return new ResponseEntity<>(classDtoRes,HttpStatus.OK);
    }

    @DeleteMapping("/{classId}")
    public ResponseEntity<ClassDTO> deleteClass(@PathVariable int classId){
        classService.delete(classId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{classId}/students")
    public ResponseEntity<List<StudentDTO>> getClassStudents(@PathVariable int classId){
        List<StudentDTO> studentDTOList = classService.getStudentsOfClass(classId);
        return new ResponseEntity<>(studentDTOList,HttpStatus.OK);
    }

    @GetMapping("/{classId}/sections/{sectionId}/students")
    public ResponseEntity<List<StudentDTO>> getClassSectionStudents(@PathVariable int classId, @PathVariable int sectionId){
        List<StudentDTO> studentDTOList = classService.getStudentsOfClassSection(classId,sectionId);
        return new ResponseEntity<>(studentDTOList,HttpStatus.OK);
    }

    @GetMapping("/{classId}/sections")
    public ResponseEntity<List<SectionDTO>> getClassSections(@PathVariable int classId){
        List<SectionDTO> sectionDTOList = classService.getSectionsOfClass(classId);
        return new ResponseEntity<>(sectionDTOList,HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ClassDTO>> getAllClasses(){
        List<ClassDTO> classDTOList = classService.getAllClasses();
        return new ResponseEntity<>(classDTOList,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassDTO> getClassById(@PathVariable int id){
        ClassDTO classDTO = classService.getClassById(id);
        return ResponseEntity.ok(classDTO);
    }


}

