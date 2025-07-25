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
@Table(name = "Exam")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int exam_id;

    @Column
    private String name;

    @Column
    private String Term;

    @OneToMany(mappedBy = "exam")
    private List<Marks> marksList;

}
