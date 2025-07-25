package com.adobe.prj.backend.dto.request;

import lombok.Data;

@Data
public class SubjectRequestDTO {
    private String subjectName;
    private String shortName;
    private int classId;
    private int userId;
}
