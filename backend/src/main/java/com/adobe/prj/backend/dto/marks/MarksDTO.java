package com.adobe.prj.backend.dto.marks;

import lombok.Data;

@Data
public class MarksDTO {
    private int studentId;
    private int gradeId;
    private int examId;
    private int score1;
    private int score2;
    private int score3;
}
