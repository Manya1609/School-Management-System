//package com.adobe.prj.backend.entity;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Embeddable;
//
//import java.io.Serializable;
//import java.util.Objects;
//@Embeddable
//public class StudentId implements Serializable {
//    @Column(name = "user_id")
//    private int userId;
//
//    // getters and setters
//    public int getUserId() {
//        return userId;
//    }
//
//    public void setUserId(int userId) {
//        this.userId = userId;
//    }
//
//    public static StudentId of(int userId) {
//        return new StudentId(userId);
//    }
//
//    // equals and hashCode
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        StudentId studentId = (StudentId) o;
//        return userId == studentId.userId;
//    }
//
//    @Override
//    public int hashCode() {
//        return Objects.hash(userId);
//    }
//}