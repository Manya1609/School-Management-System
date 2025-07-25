package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.managetimetable.ManageTimeTableDTO;
import com.adobe.prj.backend.dto.managetimetable.TimeTablePDF;
import com.adobe.prj.backend.dto.marks.TabulationPDF;
import com.adobe.prj.backend.dto.timetable.TimeTableType;
import com.adobe.prj.backend.entity.ManageTimeTable;
import com.adobe.prj.backend.entity.SystemSettings;
import com.adobe.prj.backend.entity.TimeSlot;
import com.adobe.prj.backend.entity.TimeTable;
import com.adobe.prj.backend.mapper.ManageTimeTableMapper;
import com.adobe.prj.backend.repository.ManageTimeTableRepository;
import com.adobe.prj.backend.repository.SystemSettingsRepository;
import com.adobe.prj.backend.repository.TimeTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManageTimeTableService {
    @Autowired
    SystemSettingsRepository systemSettingsRepository;
    @Autowired
    private ManageTimeTableRepository manageTimeTableRepository;

    @Autowired
    private ManageTimeTableMapper manageTimeTableMapper;
    @Autowired
    private TimeTableRepository timeTableRepository;

    public void create(ManageTimeTableDTO manageTimeTableDTO) {
        manageTimeTableRepository.save(manageTimeTableMapper.toEntity(manageTimeTableDTO));
    }

    public List<ManageTimeTableDTO> getAll() {
        return manageTimeTableRepository.findAll().stream().map(manageTimeTableMapper::toDTO).collect(Collectors.toList());
    }

    public void update(ManageTimeTableDTO manageTimeTableDTO) {
        manageTimeTableRepository.save(manageTimeTableMapper.toEntity(manageTimeTableDTO));
    }

    public void delete(int manageTimeTableId) {
        manageTimeTableRepository.deleteById(manageTimeTableId);
    }

    public List<TimeTablePDF> getpdf(int timeTableId, int systemId) {
        List<ManageTimeTable> manageTimeTableList = timeTableRepository.findById(timeTableId).get().getManageTimeTableList();
        TimeTable timeTable = timeTableRepository.findById(timeTableId).get();
        SystemSettings systemSettings = systemSettingsRepository.findById(1).get(); //change 1 to systemId
        List<TimeTablePDF> timeTablePDFList = new ArrayList<>();
        for(int i=0;i<manageTimeTableList.size();i++) {
            TimeTablePDF timeTablePDF = new TimeTablePDF();
            timeTablePDF.setCurrentSession(systemSettings.getCurrentSession());
            timeTablePDF.setSchoolName(systemSettings.getNameOfSchool());
//            TimeTable timeTable = timeTableRepository.findById(manageTimeTable.getTimeTable().getId()).get();
//            if (timeTable.getTimeTableType().equals(TimeTableType.CLASS)) {
            timeTablePDF.setDay(manageTimeTableList.get(i).getClassDay().getValue());
//            } else {
//                timeTablePDF.setDate(manageTimeTableList.get(i).getExamDate());
//            }
            timeTablePDF.setClassName(timeTable.getClazz().getName());
            timeTablePDF.setTimeSlot(manageTimeTableList.get(i).getTimeSlot().getStartTime()+"-"+manageTimeTableList.get(i).getTimeSlot().getEndTime());
            timeTablePDF.setSubject(manageTimeTableList.get(i).getSubject().getSubjectName());
            timeTablePDFList.add(timeTablePDF);
        }
        return timeTablePDFList;



    }
}
