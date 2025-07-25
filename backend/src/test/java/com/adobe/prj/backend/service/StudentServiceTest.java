package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.student.StudentDTO;
import com.adobe.prj.backend.dto.student.StudentPromoteRequest;
import com.adobe.prj.backend.entity.Section;
import com.adobe.prj.backend.entity.Student;
import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.StudentMapper;
import com.adobe.prj.backend.repository.ClassRepository;
import com.adobe.prj.backend.repository.SectionRepository;
import com.adobe.prj.backend.repository.StudentRepository;
import com.adobe.prj.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
public class StudentServiceTest {

    @InjectMocks
    private StudentService studentService;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private StudentMapper studentMapper;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private UserRepository userRepository;

    private Student student;
    private StudentDTO studentDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        student = new Student();
        student.setId(1);
        student.setClazz(new Class());  // Assign a new Class object
        student.setSection(new Section());  // Assign a new Section object
        studentDTO = new StudentDTO();
        studentDTO.setAdmissionNumber(123);
        studentDTO.setDormitory("Dorm A");
    }

    @Test
    void createStudent() {
        when(studentMapper.toEntity(any(StudentDTO.class))).thenReturn(student);
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(studentMapper.toDTO(any(Student.class))).thenReturn(studentDTO);

        StudentDTO result = studentService.create(studentDTO);

        assertNotNull(result);
        assertEquals(123, result.getAdmissionNumber());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void getStudent_Success() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        when(studentMapper.toDTO(any(Student.class))).thenReturn(studentDTO);

        StudentDTO result = studentService.getStudents(1);

        assertNotNull(result);
        verify(studentRepository, times(1)).findById(1);
    }

    @Test
    void getStudent_NotFound() {
        when(studentRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.getStudents(1));
    }

    @Test
    void promoteStudents() {
        // Set initial class and section IDs
        student.getClazz().setId(1);
        student.getSection().setId(1);

        // Prepare the request
        StudentPromoteRequest request = new StudentPromoteRequest();
        request.setStudentIdList(Arrays.asList(1));
        request.setPromoted(Arrays.asList(true));
        request.setToClassId(2); // New class ID
        request.setToSectionId(3); // New section ID

        // Mocking the necessary methods
        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        Class newClass = new Class();
        newClass.setId(2); // Set new class ID
        when(classRepository.getReferenceById(2)).thenReturn(newClass);
        Section newSection = new Section();
        newSection.setId(3); // Set new section ID
        when(sectionRepository.getReferenceById(3)).thenReturn(newSection);

        // Call the method under test
        studentService.promotingStudents(request);

        // Verify interactions and state
        verify(studentRepository, times(1)).save(student);
        assertEquals(2, student.getClazz().getId()); // Verify class ID updated
        assertEquals(3, student.getSection().getId()); // Verify section ID updated
    }


    @Test
    void updateStudent_NotFound() {
        when(studentRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.update(1, studentDTO));
    }

    @Test
    void deleteStudent_Success() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(student));

        assertDoesNotThrow(() -> studentService.delete(1));
        verify(studentRepository, times(1)).deleteById(1);
    }

    @Test
    void deleteStudent_NotFound() {
        when(studentRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.delete(1));
    }
}
