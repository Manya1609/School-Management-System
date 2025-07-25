package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.Class.ClassDTO;
import com.adobe.prj.backend.dto.section.SectionDTO;
import com.adobe.prj.backend.dto.student.StudentDTO;
import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.entity.Section;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.ClassMapper;
import com.adobe.prj.backend.mapper.SectionMapper;
import com.adobe.prj.backend.mapper.StudentMapper;
import com.adobe.prj.backend.repository.ClassRepository;
import com.adobe.prj.backend.repository.SectionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ClassServiceTest {
    @Mock
    private ClassRepository classRepository;

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private ClassMapper classMapper;

    @Mock
    private StudentMapper studentMapper;

    @Mock
    private SectionMapper sectionMapper;

    @InjectMocks
    private ClassService classService;

    private Class testClass;
    private ClassDTO testClassDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testClass = new Class(1, "Class 1", "Primary", null, null, null, null, null);
        testClassDTO = new ClassDTO(1, "Class 1", "Primary");
    }

    @Test
    void testCreateClass() {
        when(classMapper.toEntity(testClassDTO)).thenReturn(testClass);
        when(classRepository.save(testClass)).thenReturn(testClass);
        when(classMapper.toDTO(testClass)).thenReturn(testClassDTO);

        ClassDTO result = classService.create(testClassDTO);

        assertNotNull(result);
        assertEquals(testClassDTO, result);
        verify(classRepository, times(1)).save(testClass);
    }

    @Test
    void testUpdateClass_Success() {
        when(classRepository.findById(1)).thenReturn(Optional.of(testClass));
        when(classMapper.toDTO(any(Class.class))).thenReturn(testClassDTO);
        when(classRepository.save(any(Class.class))).thenReturn(testClass);

        ClassDTO result = classService.update(1, testClassDTO);

        assertNotNull(result);
        assertEquals(testClassDTO, result);
        verify(classRepository, times(1)).save(testClass);
    }

    @Test
    void testUpdateClass_NotFound() {
        when(classRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> classService.update(1, testClassDTO));
    }

    @Test
    void testDeleteClass() {
        doNothing().when(classRepository).deleteById(1);

        classService.delete(1);

        verify(classRepository, times(1)).deleteById(1);
    }

    @Test
    void testGetAllClasses() {
        when(classRepository.findAll()).thenReturn(List.of(testClass));
        when(classMapper.toDTO(testClass)).thenReturn(testClassDTO);

        List<ClassDTO> result = classService.getAllClasses();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(classRepository, times(1)).findAll();
    }
}
