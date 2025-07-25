package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.managetimetable.ManageTimeTableDTO;
import com.adobe.prj.backend.entity.ManageTimeTable;
import com.adobe.prj.backend.repository.SubjectRepository;
import com.adobe.prj.backend.repository.TimeSlotRepository;
import com.adobe.prj.backend.repository.TimeTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;

@Component
public class ManageTimeTableMapper {
    @Autowired
    private TimeSlotRepository timeSlotRepository;
    @Autowired
    private TimeTableRepository timeTableRepository;
    @Autowired
    private SubjectRepository subjectRepository;

    public ManageTimeTable toEntity(ManageTimeTableDTO manageTimeTableDTO) {
        ManageTimeTable manageTimeTable = new ManageTimeTable();
        manageTimeTable.setId(manageTimeTableDTO.getId());
        manageTimeTable.setTimeSlot(timeSlotRepository.findById(manageTimeTableDTO.getTimeSlotId()).orElse(null));
        manageTimeTable.setTimeTable(timeTableRepository.findById(manageTimeTableDTO.getTimeTableId()).orElse(null));
        manageTimeTable.setSubject(subjectRepository.findById(manageTimeTableDTO.getSubjectId()).orElse(null));
        int safeDayOfWeek = manageTimeTableDTO.getDayOfWeek();
        if(safeDayOfWeek==0) safeDayOfWeek = 1;
        manageTimeTable.setClassDay(DayOfWeek.of(safeDayOfWeek));
        manageTimeTable.setExamDate(manageTimeTableDTO.getDate());
        return manageTimeTable;
    }
    public ManageTimeTableDTO toDTO(ManageTimeTable manageTimeTable) {
        ManageTimeTableDTO manageTimeTableDTO = new ManageTimeTableDTO();
        manageTimeTableDTO.setId(manageTimeTable.getId());
        manageTimeTableDTO.setSubjectId(manageTimeTable.getSubject().getId());
        manageTimeTableDTO.setTimeTableId(manageTimeTable.getTimeTable().getId());
        manageTimeTableDTO.setTimeSlotId(manageTimeTable.getTimeSlot().getId());
        manageTimeTableDTO.setDate(manageTimeTable.getExamDate());
        manageTimeTableDTO.setDayOfWeek(manageTimeTable.getClassDay().getValue());
        return manageTimeTableDTO;

    }
}
