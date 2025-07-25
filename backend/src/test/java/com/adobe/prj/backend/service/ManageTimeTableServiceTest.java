package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.managetimetable.ManageTimeTableDTO;
import com.adobe.prj.backend.entity.ManageTimeTable;
import com.adobe.prj.backend.mapper.ManageTimeTableMapper;
import com.adobe.prj.backend.repository.ManageTimeTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class ManageTimeTableServiceTest {

    @Mock
    private ManageTimeTableRepository manageTimeTableRepository;

    @Mock
    private ManageTimeTableMapper manageTimeTableMapper;

    @InjectMocks
    private ManageTimeTableService manageTimeTableService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreate() {
        ManageTimeTableDTO dto = new ManageTimeTableDTO();
        ManageTimeTable manageTimeTable = new ManageTimeTable();
        when(manageTimeTableMapper.toEntity(dto)).thenReturn(manageTimeTable);

        manageTimeTableService.create(dto);
        verify(manageTimeTableRepository, times(1)).save(manageTimeTable);
    }

    @Test
    void testGetAll() {
        List<ManageTimeTable> manageTimeTables = Arrays.asList(new ManageTimeTable(), new ManageTimeTable());
        when(manageTimeTableRepository.findAll()).thenReturn(manageTimeTables);
        when(manageTimeTableMapper.toDTO(any(ManageTimeTable.class))).thenReturn(new ManageTimeTableDTO());

        List<ManageTimeTableDTO> dtos = manageTimeTableService.getAll();
        assertEquals(2, dtos.size());
        verify(manageTimeTableRepository, times(1)).findAll();
    }

    @Test
    void testUpdate() {
        ManageTimeTableDTO dto = new ManageTimeTableDTO();
        ManageTimeTable manageTimeTable = new ManageTimeTable();
        when(manageTimeTableMapper.toEntity(dto)).thenReturn(manageTimeTable);

        manageTimeTableService.update(dto);
        verify(manageTimeTableRepository, times(1)).save(manageTimeTable);
    }

    @Test
    void testDelete() {
        int manageTimeTableId = 1;
        manageTimeTableService.delete(manageTimeTableId);
        verify(manageTimeTableRepository, times(1)).deleteById(manageTimeTableId);
    }
}
