package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.timeslot.TimeSlotDTO;
import com.adobe.prj.backend.service.TimeSlotService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class TimeSlotControllerTest {

    @Mock
    private TimeSlotService timeSlotService;

    @InjectMocks
    private TimeSlotController timeSlotController;

    private TimeSlotDTO timeSlotDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);

        timeSlotDTO = new TimeSlotDTO();
        timeSlotDTO.setId(1);
        timeSlotDTO.setStartTime(new Date());
        timeSlotDTO.setEndTime(new Date());
    }

    @Test
    void testCreateTimeSlot() {
        ResponseEntity<TimeSlotDTO> response = timeSlotController.createTimeSlot(timeSlotDTO);

        verify(timeSlotService, times(1)).create(timeSlotDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testGetAllTimeSlots() {
        when(timeSlotService.getAll()).thenReturn(Arrays.asList(timeSlotDTO));

        ResponseEntity<List<TimeSlotDTO>> response = timeSlotController.getAllTimeSlots();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(timeSlotService, times(1)).getAll();
    }

    @Test
    void testUpdateTimeSlot() {
        ResponseEntity<TimeSlotDTO> response = timeSlotController.updateTimeSlot(timeSlotDTO);

        verify(timeSlotService, times(1)).update(timeSlotDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteTimeSlot() {
        ResponseEntity<TimeSlotDTO> response = timeSlotController.deleteTimeSlot(1);

        verify(timeSlotService, times(1)).delete(1);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

}
