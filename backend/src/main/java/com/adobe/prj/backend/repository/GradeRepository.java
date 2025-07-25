package com.adobe.prj.backend.repository;

import com.adobe.prj.backend.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Integer> {
    @Query("SELECT g FROM Grade g WHERE :marks > g.mark_from AND :marks <= g.mark_to")
    Grade findGradeByMarks(@Param("marks") int marks);
}
