package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.marks.MarksDTO;
import com.adobe.prj.backend.dto.marks.TabulationData;
import com.adobe.prj.backend.dto.marks.TabulationPDF;
import com.adobe.prj.backend.entity.Marks;
import com.adobe.prj.backend.entity.Student;
import com.adobe.prj.backend.entity.StudentEnrollment;
import com.adobe.prj.backend.mapper.MarksMapper;
import com.adobe.prj.backend.mapper.StudentMapper;
import com.adobe.prj.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
public class MarksServiceTest {
    @Mock
    private MarksRepository marksRepository;

    @Mock
    private MarksMapper marksMapper;

    @Mock
    private StudentMapper studentMapper;

    @Mock
    private ClassService classService;

    @Mock
    private StudentEnrollmentRepository studentEnrollmentRepository;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private MarksService marksService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testAddMarks() {
        List<MarksDTO> marksDTOList = Arrays.asList(new MarksDTO(), new MarksDTO());
        marksService.addMarks(marksDTOList, 1, 1, 1, 1);
        verify(marksMapper, times(1)).toEntityList(marksDTOList, 1, 1, 1, 1);
    }


    @Test
    public void testUpdateMarks() {
        List<MarksDTO> marksDTOList = Arrays.asList(new MarksDTO(), new MarksDTO());
        marksService.update(marksDTOList, 1, 1, 1, 1);
        verify(marksMapper, times(1)).toEntityList(marksDTOList, 1, 1, 1, 1);
    }






}
