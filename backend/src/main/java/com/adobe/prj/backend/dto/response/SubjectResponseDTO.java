package com.adobe.prj.backend.dto.response;

import lombok.Data;

@Data
public class SubjectResponseDTO {
    private int subjectId;
    private String subjectName;
    private String shortName;
    private int classId;
    private String className;
    private int userId;
    private String teacherName;
    private String teacherEmail;

}
