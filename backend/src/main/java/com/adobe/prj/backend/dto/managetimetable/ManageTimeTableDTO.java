package com.adobe.prj.backend.dto.managetimetable;

import lombok.Data;

import java.time.DayOfWeek;
import java.util.Date;

@Data
public class ManageTimeTableDTO {
    private int id;
    private int timeTableId;
    private int timeSlotId;
    private int subjectId;
    private Date date; // for Exam
    private int dayOfWeek; // for Class
}
