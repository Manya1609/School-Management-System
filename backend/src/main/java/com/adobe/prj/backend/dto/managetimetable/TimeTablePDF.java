package com.adobe.prj.backend.dto.managetimetable;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TimeTablePDF {
    private String schoolName;
    private String currentSession;
    private String className;
    private String timeSlot;
    private int day; //{1,2,3,4,5,6}

//    @Temporal(TemporalType.TIMESTAMP)
//    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
//    private Date date;

    private String subject;


}
