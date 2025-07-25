package com.adobe.prj.backend.dto.marks;

import lombok.Data;

import java.util.List;

@Data
public class TabulationData {
    private int studentId;
    private List<Integer> subjectIdList;
    private List<Integer> totalScoreList;
}
