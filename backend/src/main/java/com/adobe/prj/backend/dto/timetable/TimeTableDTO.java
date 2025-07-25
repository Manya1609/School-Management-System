package com.adobe.prj.backend.dto.timetable;

import com.adobe.prj.backend.entity.Class;
import lombok.Data;

@Data
public class TimeTableDTO {
    private int id;
    private String name;
    private int classId;
    private String timeTableType;

}
