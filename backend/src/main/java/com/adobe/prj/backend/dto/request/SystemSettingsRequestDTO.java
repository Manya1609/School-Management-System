package com.adobe.prj.backend.dto.request;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.Date;

@Data
public class SystemSettingsRequestDTO {
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
