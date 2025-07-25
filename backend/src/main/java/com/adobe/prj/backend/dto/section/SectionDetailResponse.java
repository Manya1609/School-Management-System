package com.adobe.prj.backend.dto.section;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SectionDetailResponse {
    private int sectionId;

    private int classId;

    private String className;

    private String sectionName;

    private String TeacherName;
}
