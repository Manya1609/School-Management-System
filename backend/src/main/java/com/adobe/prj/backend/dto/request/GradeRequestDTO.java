package com.adobe.prj.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GradeRequestDTO {

    @NotBlank
    private String gradeName;

    private String gradeType;

    @Min(0)
    @Max(100)
    private int markFrom;

    @Min(0)
    @Max(100)
    private int markTo;

    private String gradeRemark;

}
