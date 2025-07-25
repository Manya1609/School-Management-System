package com.adobe.prj.backend.service;



import com.adobe.prj.backend.dto.section.SectionDTO;
import com.adobe.prj.backend.dto.section.SectionDetailResponse;
import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.entity.Section;
import com.adobe.prj.backend.entity.Teacher;
import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.SectionMapper;
import com.adobe.prj.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class SectionServiceTest {

    @InjectMocks
    private SectionService sectionService;

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private SectionMapper sectionMapper;

    private Section section;
    private SectionDTO sectionDTO;
    private Teacher teacher;
    private User user;
    private Class clazz;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        clazz = new Class();
        clazz.setId(1);

        teacher = new Teacher();
        teacher.setId(2);

        section = new Section();
        section.setId(1);
        section.setName("A");
        section.setClazz(clazz);
        section.setTeacher(teacher);

        sectionDTO = new SectionDTO();
        sectionDTO.setId(1);
        sectionDTO.setName("A");
        sectionDTO.setClassId(1);
        sectionDTO.setUserId(2);
    }

    @Test
    public void testCreateSection() {
        when(sectionMapper.toEntity(sectionDTO)).thenReturn(section);
        when(sectionRepository.save(section)).thenReturn(section);
        when(sectionMapper.toDTO(section)).thenReturn(sectionDTO);

        SectionDTO result = sectionService.create(sectionDTO);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("A", result.getName());

        verify(sectionRepository, times(1)).save(section);
    }



    @Test
    public void testUpdateSection_NotFound() {
        when(sectionRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            sectionService.update(1, sectionDTO);
        });

        verify(sectionRepository, never()).save(any(Section.class));
    }

    @Test
    public void testDeleteSection() {
        when(sectionRepository.findById(1)).thenReturn(Optional.of(section));

        sectionService.delete(1);

        verify(sectionRepository, times(1)).deleteById(1);
    }

    @Test
    public void testDeleteSection_NotFound() {
        when(sectionRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            sectionService.delete(1);
        });

        verify(sectionRepository, never()).deleteById(1);
    }
}
