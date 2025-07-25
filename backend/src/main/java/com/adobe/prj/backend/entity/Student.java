package com.adobe.prj.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
//@IdClass(StudentId.class)
public class Student{
    @Id
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @MapsId
    private User user;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class clazz;

    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

    @OneToMany(mappedBy = "student")
    private List<StudentEnrollment> studentEnrollmentList;

    @Column
    private String parent;
    @Column
    private int yearAdmitted;
    @Column
    private String dormitory;
    @Column
    private int dormitoryNumber;
    @Column
    private String sportsHouse;
    @Column
    private int admissionNumber;

}
