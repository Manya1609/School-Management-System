package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.Class.ClassDTO;
import com.adobe.prj.backend.service.ClassService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class ClassControllerTest {
    @Mock
    private ClassService classService;

    @InjectMocks
    private ClassController classController;

    private ClassDTO testClassDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testClassDTO = new ClassDTO(1, "Class 1", "Primary");
    }

    @Test
    void testCreateClass() {
        when(classService.create(testClassDTO)).thenReturn(testClassDTO);

        ResponseEntity<ClassDTO> response = classController.createClass(testClassDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testClassDTO, response.getBody());
        verify(classService, times(1)).create(testClassDTO);
    }
    @Test
    void testUpdateClass() {
        when(classService.update(1, testClassDTO)).thenReturn(testClassDTO);

        ResponseEntity<ClassDTO> response = classController.updateClass(1, testClassDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testClassDTO, response.getBody());
        verify(classService, times(1)).update(1, testClassDTO);
    }

    @Test
    void testDeleteClass() {
        doNothing().when(classService).delete(1);

        ResponseEntity<ClassDTO> response = classController.deleteClass(1);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(classService, times(1)).delete(1);
    }

    @Test
    void testGetAllClasses() {
        when(classService.getAllClasses()).thenReturn(List.of(testClassDTO));

        ResponseEntity<List<ClassDTO>> response = classController.getAllClasses();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(classService, times(1)).getAllClasses();
    }

}
