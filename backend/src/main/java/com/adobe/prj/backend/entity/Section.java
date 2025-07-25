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
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="class_id")
    private Class clazz;

    @Column(name="section_name")
    private String name;

    @OneToOne
    @JoinColumn(name="teacher_id")
    private Teacher teacher;

    @OneToMany(mappedBy = "section")
    private List<StudentEnrollment> studentEnrollmentList;

    @OneToMany(mappedBy = "section")
    private List<Student> studentList;


}
