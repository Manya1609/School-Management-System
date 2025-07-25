package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.timeslot.TimeSlotDTO;
import com.adobe.prj.backend.entity.TimeSlot;
import jakarta.persistence.Column;
import org.springframework.stereotype.Component;

@Component
public class TimeSlotMapper {
    public TimeSlot toEntity(TimeSlotDTO timeSlotDTO) {
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(timeSlotDTO.getId());
        timeSlot.setStartTime(timeSlotDTO.getStartTime());
        timeSlot.setEndTime(timeSlotDTO.getEndTime());
        return timeSlot;
    }
    public TimeSlotDTO toDTO(TimeSlot timeSlot) {
        TimeSlotDTO timeSlotDTO = new TimeSlotDTO();
        timeSlotDTO.setStartTime(timeSlot.getStartTime());
        timeSlotDTO.setEndTime(timeSlot.getEndTime());
        timeSlotDTO.setId(timeSlot.getId());
        return timeSlotDTO;
    }
}


