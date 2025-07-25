package com.adobe.prj.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name="grade")
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int grade_id;

    @Column(name = "grade_name")
    private String grade_name;

    @Column(name = "grade_type")
    private String grade_type;

    @Column(name = "mark_from")
    private int mark_from;

    @Column(name = "mark_to")
    private int mark_to;

    @Column(name = "grade_remark")
    private String grade_remark;

    @OneToMany(mappedBy = "grade", fetch = FetchType.LAZY)
    private List<Marks> marksList;
}
