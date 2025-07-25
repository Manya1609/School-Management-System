package com.adobe.prj.backend.controller;


import com.adobe.prj.backend.dto.marks.MarksDTO;
import com.adobe.prj.backend.dto.marks.TabulationData;
import com.adobe.prj.backend.dto.marks.TabulationPDF;
import com.adobe.prj.backend.service.MarksService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
public class MarksControllerTest {

    @Mock
    private MarksService marksService;

    @InjectMocks
    private MarksConroller marksController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testPostMarks() {
        List<MarksDTO> marksDTOList = Arrays.asList(new MarksDTO(), new MarksDTO());
        marksController.postMarks(marksDTOList, 1, 1, 1, 1);
        verify(marksService, times(1)).addMarks(marksDTOList, 1, 1, 1, 1);
    }

    @Test
    public void testGetAllMarks() {
        List<MarksDTO> marksDTOList = Arrays.asList(new MarksDTO(), new MarksDTO());
        when(marksService.getMarks(1, 1, 1, 1)).thenReturn(marksDTOList);

        ResponseEntity<List<MarksDTO>> response = marksController.getAllMarks(1, 1, 1, 1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(marksDTOList, response.getBody());
    }

    @Test
    public void testUpdateMarks() {
        List<MarksDTO> marksDTOList = Arrays.asList(new MarksDTO(), new MarksDTO());
        marksController.updateMarks(marksDTOList, 1, 1, 1, 1);
        verify(marksService, times(1)).update(marksDTOList, 1, 1, 1, 1);
    }

    @Test
    public void testGetTotalMarks() {
        List<TabulationData> tabulationDataList = Arrays.asList(new TabulationData(), new TabulationData());
        when(marksService.getTabulation(1, 1, 1)).thenReturn(tabulationDataList);

        ResponseEntity<List<TabulationData>> response = marksController.getTotalMarks(1, 1, 1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(tabulationDataList, response.getBody());
    }


}
