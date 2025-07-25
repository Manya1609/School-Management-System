package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.timetable.TimeTableDTO;
import com.adobe.prj.backend.mapper.TimeTableMapper;
import com.adobe.prj.backend.repository.TimeTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimeTableService {
    @Autowired
    private TimeTableRepository timeTableRepository;

    @Autowired
    private TimeTableMapper timeTableMapper;

    public void create(TimeTableDTO timeTableDTO) {
        timeTableRepository.save(timeTableMapper.toEntity(timeTableDTO));
    }

    public List<TimeTableDTO> getAll() {
        return timeTableRepository.findAll().stream().map(timeTableMapper::toDTO).collect(Collectors.toList());
    }

    public void update(TimeTableDTO timeTableDTO) {
        timeTableRepository.save(timeTableMapper.toEntity(timeTableDTO));
    }

    public void delete(int timeTableId) {
        timeTableRepository.deleteById(timeTableId);
    }
}
