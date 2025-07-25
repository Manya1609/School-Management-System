package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.timetable.TimeTableDTO;
import com.adobe.prj.backend.dto.timetable.TimeTableType;
import com.adobe.prj.backend.entity.TimeTable;
import com.adobe.prj.backend.repository.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;

@Component
public class TimeTableMapper {
    @Autowired
    private ClassRepository classRepository;

    public TimeTable toEntity(TimeTableDTO timeTableDTO) {
        TimeTable timeTable = new TimeTable();
        timeTable.setId(timeTableDTO.getId());
        timeTable.setName(timeTableDTO.getName());
        timeTable.setClazz(classRepository.findById(timeTableDTO.getClassId()).orElse(null));
        timeTable.setTimeTableType(TimeTableType.fromString(timeTableDTO.getTimeTableType()));
        return timeTable;
    }
    public TimeTableDTO toDTO(TimeTable timeTable) {
        TimeTableDTO timeTableDTO = new TimeTableDTO();
        timeTableDTO.setName(timeTable.getName());
        timeTableDTO.setClassId(timeTable.getClazz().getId());
        timeTableDTO.setTimeTableType(timeTable.getTimeTableType().getValue());
        timeTableDTO.setId(timeTable.getId());
        return timeTableDTO;
    }
}
