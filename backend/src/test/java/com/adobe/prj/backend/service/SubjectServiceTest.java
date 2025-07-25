package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.request.SubjectRequestDTO;
import com.adobe.prj.backend.dto.response.SubjectResponseDTO;
import com.adobe.prj.backend.dto.response.SystemSettingsResponseDTO;
import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.entity.Subject;
import com.adobe.prj.backend.entity.SystemSettings;
import com.adobe.prj.backend.entity.Teacher;
import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.SubjectMapper;
import com.adobe.prj.backend.repository.SubjectRepository;
import com.adobe.prj.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
public class SubjectServiceTest {

    @InjectMocks
    private SubjectService subjectService;

    @Mock
    private SubjectRepository subjectRepository;

    @Mock
    private SubjectMapper subjectMapper;

    @MockBean
    private UserRepository userRepository;

    private Subject subject;
    private SubjectRequestDTO requestDTO;
    private SubjectResponseDTO responseDTO;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        subject = new Subject();
        subject.setId(1);
        subject.setSubjectName("Mathematics");



        requestDTO = new SubjectRequestDTO();
        requestDTO.setSubjectName("Mathematics");
        requestDTO.setShortName("Math");

        responseDTO = new SubjectResponseDTO();
        responseDTO.setSubjectId(1);
        responseDTO.setSubjectName("Mathematics");
    }


    @Test
    void getSubjectById() throws ResourceNotFoundException {
        when(subjectRepository.findById(1)).thenReturn(Optional.of(subject));
        when(subjectMapper.toDto(any())).thenReturn(responseDTO);

        SubjectResponseDTO result = subjectService.getSubjectById(1);

        assertNotNull(result);
        assertEquals("Mathematics", result.getSubjectName());
        verify(subjectRepository, times(1)).findById(1);
    }




}
