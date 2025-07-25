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
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "class_name")
    private String name;

    @Column(name = "class_type")
    private String classType;


    @OneToMany(mappedBy="clazz")
    private List<Section> sectionList;

    @OneToMany(mappedBy = "clazz")
    private List<Subject> subjectList;

    @OneToMany(mappedBy = "clazz")
    private List<Student> studentList;

    @OneToMany(mappedBy = "clazz")
    private List<TimeTable> timeTableList;

    @OneToMany(mappedBy = "clazz")
    private List<TeacherEnrollment> teacherEnrollmentList;


}
