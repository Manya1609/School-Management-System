package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.timeslot.TimeSlotDTO;
import com.adobe.prj.backend.entity.TimeSlot;
import com.adobe.prj.backend.mapper.TimeSlotMapper;
import com.adobe.prj.backend.repository.TimeSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
public class TimeSlotServiceTest {
    @Mock
    private TimeSlotRepository timeSlotRepository;

    @Mock
    private TimeSlotMapper timeSlotMapper;

    @InjectMocks
    private TimeSlotService timeSlotService;

    private TimeSlotDTO timeSlotDTO;
    private TimeSlot timeSlot;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);

        timeSlotDTO = new TimeSlotDTO();
        timeSlotDTO.setId(1);
        timeSlotDTO.setStartTime(new Date());
        timeSlotDTO.setEndTime(new Date());

        timeSlot = new TimeSlot();
        timeSlot.setId(1);
        timeSlot.setStartTime(new Date());
        timeSlot.setEndTime(new Date());
    }
    @Test
    void testCreate() {
        when(timeSlotMapper.toEntity(timeSlotDTO)).thenReturn(timeSlot);
        timeSlotService.create(timeSlotDTO);
        verify(timeSlotRepository, times(1)).save(timeSlot);
    }

    @Test
    void testGetAll() {
        when(timeSlotRepository.findAll()).thenReturn(Arrays.asList(timeSlot));
        when(timeSlotMapper.toDTO(timeSlot)).thenReturn(timeSlotDTO);

        List<TimeSlotDTO> timeSlotDTOList = timeSlotService.getAll();

        assertEquals(1, timeSlotDTOList.size());
        verify(timeSlotRepository, times(1)).findAll();
    }

    @Test
    void testUpdate() {
        when(timeSlotMapper.toEntity(timeSlotDTO)).thenReturn(timeSlot);
        timeSlotService.update(timeSlotDTO);
        verify(timeSlotRepository, times(1)).save(timeSlot);
    }

    @Test
    void testDelete() {
        timeSlotService.delete(1);
        verify(timeSlotRepository, times(1)).deleteById(1);
    }
}
