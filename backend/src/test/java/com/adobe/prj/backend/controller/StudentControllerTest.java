package com.adobe.prj.backend.controller;


import com.adobe.prj.backend.dto.student.StudentDTO;
import com.adobe.prj.backend.dto.student.StudentPromoteRequest;
import com.adobe.prj.backend.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
public class StudentControllerTest {

    @InjectMocks
    private StudentController studentController;

    @Mock
    private StudentService studentService;

    private StudentDTO studentDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        studentDTO = new StudentDTO();
        studentDTO.setAdmissionNumber(123);
        studentDTO.setDormitory("Dorm A");
    }

    @Test
    void createStudent() {
        when(studentService.create(any(StudentDTO.class))).thenReturn(studentDTO);

        ResponseEntity<StudentDTO> response = studentController.createStudent(studentDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(123, response.getBody().getAdmissionNumber());
        verify(studentService, times(1)).create(any(StudentDTO.class));
    }

    @Test
    void getStudent_Success() {
        when(studentService.getStudents(1)).thenReturn(studentDTO);

        ResponseEntity<StudentDTO> response = studentController.getStudent(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(123, response.getBody().getAdmissionNumber());
        verify(studentService, times(1)).getStudents(1);
    }

    @Test
    void promoteStudents() {
        doNothing().when(studentService).promotingStudents(any(StudentPromoteRequest.class));

        ResponseEntity<StudentDTO> response = studentController.promoteStudentsprom(new StudentPromoteRequest());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(studentService, times(1)).promotingStudents(any(StudentPromoteRequest.class));
    }

    @Test
    void updateStudent_Success() {
        when(studentService.update(1, studentDTO)).thenReturn(studentDTO);

        ResponseEntity<StudentDTO> response = studentController.updateStudent(1, studentDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(123, response.getBody().getAdmissionNumber());
        verify(studentService, times(1)).update(1, studentDTO);
    }

    @Test
    void deleteStudent_Success() {
        doNothing().when(studentService).delete(1);

        ResponseEntity<StudentDTO> response = studentController.deleteStudent(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(studentService, times(1)).delete(1);
    }
}
