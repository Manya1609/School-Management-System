package com.adobe.prj.backend.repository;

import com.adobe.prj.backend.entity.Exam;
import com.adobe.prj.backend.entity.Marks;
import com.adobe.prj.backend.entity.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Integer> {

    @Query("SELECT m FROM Marks m WHERE m.exam.exam_id = :examId AND m.studentEnrollment.id = :studentEnrollmentId")
    Optional<Marks> findByExamAndStudentEnrollment(@Param("examId") int examId, @Param("studentEnrollmentId") int seId);


}
