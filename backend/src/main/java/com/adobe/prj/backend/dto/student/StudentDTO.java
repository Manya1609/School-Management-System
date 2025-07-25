package com.adobe.prj.backend.dto.student;

import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.entity.Section;
import com.adobe.prj.backend.entity.StudentEnrollment;
import com.adobe.prj.backend.entity.User;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO   {
//    private int id;
    private int userId;
    private int classId;
    private int sectionId;
    private String parent;
    private int yearAdmitted;
    private String dormitory;
    private int dormitoryNumber;
    private String sportsHouse;
    private int admissionNumber;
}
