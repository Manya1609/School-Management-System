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
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="subject_name")
    private String subjectName;

    @Column(name="short_name")
    private String shortName;

    @ManyToOne
    @JoinColumn(name="class_id")
    private Class clazz;

    @ManyToOne
    @JoinColumn(name="teacher_id")
    private Teacher teacher;

    @OneToMany(mappedBy = "subject")
    private List<StudentEnrollment> studentEnrollmentList;

    @OneToMany(mappedBy = "subject")
    private List<ManageTimeTable> manageTimeTableList;

    @OneToMany(mappedBy = "subject")
    private List<TeacherEnrollment> teacherEnrollmentList;


//    @OneToMany(mappedBy = "subject")
//    private List<ClassRoomManagement> crmList;
}
