package com.adobe.prj.backend.controller;


import com.adobe.prj.backend.dto.section.SectionDTO;
import com.adobe.prj.backend.dto.section.SectionDetailResponse;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.SectionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class SectionControllerTest {

    @InjectMocks
    private SectionController sectionController;

    @Mock
    private SectionService sectionService;

    private SectionDTO sectionDTO;
    private List<SectionDTO> sectionList;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        sectionDTO = new SectionDTO();
        sectionDTO.setId(1);
        sectionDTO.setName("A");

        sectionList = new ArrayList<>();
        sectionList.add(sectionDTO);
    }

    @Test
    public void testCreateSection() {
        when(sectionService.create(sectionDTO)).thenReturn(sectionDTO);

        ResponseEntity<SectionDTO> response = sectionController.createSection(sectionDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getId());
    }

    @Test
    public void testUpdateSection() throws ResourceNotFoundException {
        when(sectionService.update(1, sectionDTO)).thenReturn(sectionDTO);

        ResponseEntity<SectionDTO> response = sectionController.updateSection(1, sectionDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getId());
    }

    @Test
    public void testUpdateSection_NotFound() throws ResourceNotFoundException {
        when(sectionService.update(1, sectionDTO)).thenThrow(new ResourceNotFoundException("Section Not Found"));

        assertThrows(ResourceNotFoundException.class, () -> {
            sectionController.updateSection(1, sectionDTO);
        });
    }

    @Test
    public void testDeleteSection() throws ResourceNotFoundException {
        ResponseEntity<SectionDTO> response = sectionController.deleteSection(1);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        verify(sectionService, times(1)).delete(1);
    }


    @Test
    public void testGetMySection() {
        SectionDetailResponse sectionDetailResponse = new SectionDetailResponse();
        sectionDetailResponse.setSectionId(1);
        sectionDetailResponse.setClassId(1);
        sectionDetailResponse.setClassName("Class 1");
        sectionDetailResponse.setSectionName("A");
        sectionDetailResponse.setTeacherName("Teacher Name");

        when(sectionService.sectionOfUser(1)).thenReturn(sectionDetailResponse);

        ResponseEntity<SectionDetailResponse> response = sectionController.getMySection(1);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().getSectionId());
    }
}
