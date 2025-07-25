package com.adobe.prj.backend.dto.marks;

import lombok.Data;

import java.util.List;

@Data
public class TabulationPDF {
    private int id;
    private String studentName;
    private int admissionNumber;
    private List<String> subjectList;
    private List<Integer> finalScores;
    private int totalScore;
    private double averageScore;
    private String className;
    private String sectionName;
}
