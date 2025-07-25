package com.adobe.prj.backend.entity;


import com.adobe.prj.backend.dto.user.UserRole;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(unique=true)
    private String email;

    @Column(name ="username")
    private String userName;

    @Column
    private String password;

    @Column(name ="full_name")
    private String fullName;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="date_of_birth")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private Date dob;

    @Column
    private String gender;
    @Column
    private String address;
    @Column
    private String phone;
    @Column
    private String telephone;


    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="date_of_employment")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private Date dateOfEmployment;

    @Column
    private String nationality;
    @Column
    private String state;
    @Column
    private String lga;//local government area

    @Column(name ="blood_group")
    private String bloodGroup;

    // Field for storing the passport-size photo as a BLOB
//    @Lob
//    @Column(name="photo", nullable = true)
//    private byte[] photo;

    // One-to-One relationship with Teacher
    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL, orphanRemoval = true)
    private Teacher teacher;

    // One-to-One relationship with Admin
//    @OneToOne(mappedBy = "user")
//    private Admin admin;

    @OneToOne(mappedBy = "user")
    private Student student;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Notice> notices;
}
