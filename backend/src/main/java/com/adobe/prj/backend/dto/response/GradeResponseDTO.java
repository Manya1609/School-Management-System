package com.adobe.prj.backend.dto.response;

import lombok.Data;

@Data
public class GradeResponseDTO {
    private int gradeId;
    private String gradeName;
    private String gradeType;
    private String gradeRange;
    private String gradeRemark;
}
