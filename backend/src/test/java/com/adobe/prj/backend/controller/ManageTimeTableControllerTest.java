package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.managetimetable.ManageTimeTableDTO;
import com.adobe.prj.backend.dto.managetimetable.TimeTablePDF;
import com.adobe.prj.backend.service.ManageTimeTableService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class ManageTimeTableControllerTest {
    @Mock
    private ManageTimeTableService manageTimeTableService;

    @InjectMocks
    private ManageTimeTableController manageTimeTableController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateManageTimeTable() {
        ManageTimeTableDTO dto = new ManageTimeTableDTO();
        ResponseEntity<ManageTimeTableDTO> response = manageTimeTableController.createManageTimeTable(dto);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(manageTimeTableService, times(1)).create(dto);
    }

    @Test
    void testGetAllManageTimeTables() {
        List<ManageTimeTableDTO> dtos = Arrays.asList(new ManageTimeTableDTO(), new ManageTimeTableDTO());
        when(manageTimeTableService.getAll()).thenReturn(dtos);

        ResponseEntity<List<ManageTimeTableDTO>> response = manageTimeTableController.getAllManageTimeTables();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(manageTimeTableService, times(1)).getAll();
    }
    @Test
    void testUpdateManageTimeTable() {
        ManageTimeTableDTO dto = new ManageTimeTableDTO();
        ResponseEntity<ManageTimeTableDTO> response = manageTimeTableController.updateManageTimeTable(dto);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(manageTimeTableService, times(1)).update(dto);
    }

    @Test
    void testDeleteManageTimeTable() {
        int manageTimeTableId = 1;
        ResponseEntity<ManageTimeTableDTO> response = manageTimeTableController.deleteManageTimeTable(manageTimeTableId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(manageTimeTableService, times(1)).delete(manageTimeTableId);
    }


}
