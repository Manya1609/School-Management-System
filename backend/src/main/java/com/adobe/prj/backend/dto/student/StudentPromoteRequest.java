package com.adobe.prj.backend.dto.student;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentPromoteRequest {
    private int fromClassId;
    private int fromSectionId;
    private int toClassId;
    private int toSectionId;
    private List<Integer> studentIdList;
    private List<Boolean> promoted;
}
