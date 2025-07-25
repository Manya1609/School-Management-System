package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.timetable.TimeTableDTO;
import com.adobe.prj.backend.entity.TimeTable;
import com.adobe.prj.backend.mapper.TimeTableMapper;
import com.adobe.prj.backend.repository.TimeTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
public class TimeTableServiceTest {
    @InjectMocks
    private TimeTableService timeTableService;

    @Mock
    private TimeTableRepository timeTableRepository;

    @Mock
    private TimeTableMapper timeTableMapper;

    private TimeTable timeTable;
    private TimeTableDTO timeTableDTO;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        timeTable = new TimeTable();
        timeTable.setId(1);
        timeTable.setName("Math Schedule");

        timeTableDTO = new TimeTableDTO();
        timeTableDTO.setId(1);
        timeTableDTO.setName("Math Schedule");
    }
    @Test
    public void testCreateTimeTable() {
        when(timeTableMapper.toEntity(any(TimeTableDTO.class))).thenReturn(timeTable);
        when(timeTableRepository.save(any(TimeTable.class))).thenReturn(timeTable);

        timeTableService.create(timeTableDTO);

        verify(timeTableRepository, times(1)).save(timeTable);
    }

    @Test
    public void testGetAllTimeTables() {
        List<TimeTable> timeTableList = new ArrayList<>();
        timeTableList.add(timeTable);

        when(timeTableRepository.findAll()).thenReturn(timeTableList);
        when(timeTableMapper.toDTO(any(TimeTable.class))).thenReturn(timeTableDTO);

        List<TimeTableDTO> result = timeTableService.getAll();

        assertEquals(1, result.size());
        verify(timeTableRepository, times(1)).findAll();
    }

    @Test
    public void testUpdateTimeTable() {
        when(timeTableMapper.toEntity(any(TimeTableDTO.class))).thenReturn(timeTable);
        when(timeTableRepository.save(any(TimeTable.class))).thenReturn(timeTable);

        timeTableService.update(timeTableDTO);

        verify(timeTableRepository, times(1)).save(timeTable);
    }
    @Test
    public void testDeleteTimeTable() {
        doNothing().when(timeTableRepository).deleteById(1);

        timeTableService.delete(1);

        verify(timeTableRepository, times(1)).deleteById(1);
    }

}
