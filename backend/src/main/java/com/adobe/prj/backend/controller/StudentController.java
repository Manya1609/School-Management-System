package com.adobe.prj.backend.controller;


import com.adobe.prj.backend.dto.response.UserResponseDTO;
import com.adobe.prj.backend.dto.student.StudentDTO;
import com.adobe.prj.backend.dto.student.StudentPromoteRequest;
import com.adobe.prj.backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@RequestBody StudentDTO studentDTO){
        StudentDTO response=studentService.create(studentDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<StudentDTO> getStudent(@PathVariable int userId){
        StudentDTO studentDTO = studentService.getStudents(userId);
        return new ResponseEntity<>(studentDTO,HttpStatus.OK);
    }

    @GetMapping
    public  ResponseEntity<List<StudentDTO>> getAllStudents(){
        List<StudentDTO> studentResponseDtos = studentService.getAllStudents();
        return ResponseEntity.ok(studentResponseDtos);
    }

    @PutMapping("/promote")
    public ResponseEntity<StudentDTO> promoteStudentsprom(@RequestBody StudentPromoteRequest studentPromoteRequest){
        studentService.promotingStudents(studentPromoteRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<StudentDTO> updateStudent(@PathVariable int userId,@RequestBody StudentDTO studentDTO){
       StudentDTO response= studentService.update(userId,studentDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


    @DeleteMapping("/{studentId}")
    public ResponseEntity<StudentDTO> deleteStudent(@PathVariable int studentId){
        studentService.delete(studentId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
