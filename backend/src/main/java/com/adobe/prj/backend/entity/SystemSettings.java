package com.adobe.prj.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="system_settings")
public class SystemSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="name_of_school")
    private String nameOfSchool;

    @Column(name="current_session")
    private String currentSession;

    @Column(name="school_acronym")
    private String schoolAcronym;

    @Column
    private String phone;

    @Column(name="school_email")
    private String schoolEmail;

    @Column(name="school_address")
    private String schoolAddress;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="term_ends_date")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date termEnds;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="next_term_begins")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date nextTermBegins;

    @Column(name="lock_exam")
    private boolean lockExam;

    @Column(name="creche_fee")
    private int crecheFee;

    @Column(name="junior_sec_fee")
    private int juniorSecondaryFee;

    @Column(name="nursery_fee")
    private int nurseryFee;

    @Column(name="preNursery_fee")
    private int preNurseryFee;

    @Column(name="primary_fee")
    private int primaryFee;

    @Column(name="senior_sec_fee")
    private int seniorSecondaryFee;
}
