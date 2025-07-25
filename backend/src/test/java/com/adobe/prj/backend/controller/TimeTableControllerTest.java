package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.timetable.TimeTableDTO;
import com.adobe.prj.backend.service.TimeTableService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
public class TimeTableControllerTest {

    @InjectMocks
    private TimeTableController timeTableController;

    @Mock
    private TimeTableService timeTableService;

    private TimeTableDTO timeTableDTO;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        timeTableDTO = new TimeTableDTO();
        timeTableDTO.setId(1);
        timeTableDTO.setName("Math Schedule");
    }

    @Test
    public void testCreateTimeTable() {
        doNothing().when(timeTableService).create(any(TimeTableDTO.class));

        ResponseEntity<TimeTableDTO> response = timeTableController.createTimeTable(timeTableDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(timeTableService, times(1)).create(any(TimeTableDTO.class));
    }

    @Test
    public void testGetAllTimeTables() {
        List<TimeTableDTO> timeTableDTOList = new ArrayList<>();
        timeTableDTOList.add(timeTableDTO);

        when(timeTableService.getAll()).thenReturn(timeTableDTOList);

        ResponseEntity<List<TimeTableDTO>> response = timeTableController.getTimeTables();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(timeTableService, times(1)).getAll();
    }

    @Test
    public void testUpdateTimeTable() {
        doNothing().when(timeTableService).update(any(TimeTableDTO.class));

        ResponseEntity<TimeTableDTO> response = timeTableController.updateTimeTable(timeTableDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(timeTableService, times(1)).update(any(TimeTableDTO.class));
    }
    @Test
    public void testDeleteTimeTable() {
        doNothing().when(timeTableService).delete(1);

        ResponseEntity<Void> response = timeTableController.deleteTimeTable(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(timeTableService, times(1)).delete(1);
    }
}
