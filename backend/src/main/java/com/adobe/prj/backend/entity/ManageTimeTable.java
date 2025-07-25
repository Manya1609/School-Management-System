package com.adobe.prj.backend.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class ManageTimeTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "time_table_id")
    private TimeTable timeTable;

    @ManyToOne
    @JoinColumn(name = "time_slot_id")
    private TimeSlot timeSlot;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Temporal(TemporalType.TIMESTAMP)
    @Column
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date examDate;

    @Column
    @Enumerated(EnumType.STRING)
    private DayOfWeek classDay;  // number -> DayOfWeek map




}
