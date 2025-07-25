package com.adobe.prj.backend.dto.response;

import lombok.Data;

import java.util.Date;
@Data
public class SystemSettingsResponseDTO {
    private int id;
    private String nameOfSchool;
    private String currentSession;
    private String schoolAcronym;
    private String phone;
    private String schoolEmail;
    private String schoolAddress;
    private Date termEnds;
    private Date nextTermBegins;
    private boolean lockExam;
    private int crecheFee;
    private int juniorSecondaryFee;
    private int nurseryFee;
    private int preNurseryFee;
    private int primaryFee;
    private int seniorSecondaryFee;
}
