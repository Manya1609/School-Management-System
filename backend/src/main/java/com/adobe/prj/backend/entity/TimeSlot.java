package com.adobe.prj.backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="start_time")
    @JsonFormat(pattern = "HH:mm:ss")
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="end_time")
    @JsonFormat(pattern = "HH:mm:ss")
    private Date endTime;

    @OneToMany(mappedBy = "timeSlot")
    private List<ManageTimeTable> manageTimeTableList;

}
