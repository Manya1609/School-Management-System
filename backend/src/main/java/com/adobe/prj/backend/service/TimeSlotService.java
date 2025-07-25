package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.timeslot.TimeSlotDTO;
import com.adobe.prj.backend.mapper.TimeSlotMapper;
import com.adobe.prj.backend.repository.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimeSlotService {
    @Autowired
    TimeSlotRepository timeSlotRepository;

    @Autowired
    TimeSlotMapper timeSlotMapper;

    public void create(TimeSlotDTO timeSlotDTO) {
        timeSlotRepository.save(timeSlotMapper.toEntity(timeSlotDTO));
    }

    public List<TimeSlotDTO> getAll() {
        return timeSlotRepository.findAll().stream().map(timeSlotMapper::toDTO).collect(Collectors.toList());
    }

    public void update(TimeSlotDTO timeSlotDTO) {
        timeSlotRepository.save(timeSlotMapper.toEntity(timeSlotDTO));
    }

    public void delete(int timeSlotId) {
        timeSlotRepository.deleteById(timeSlotId);
    }
}
