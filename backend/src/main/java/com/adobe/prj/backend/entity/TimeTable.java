package com.adobe.prj.backend.entity;

import com.adobe.prj.backend.dto.timetable.TimeTableType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class TimeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class clazz;

    @Column(name = "time_table_type")
    @Enumerated(EnumType.STRING)
    private TimeTableType timeTableType;

    @OneToMany(mappedBy = "timeTable")
    private List<ManageTimeTable> manageTimeTableList;



}
