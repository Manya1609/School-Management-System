package com.adobe.prj.backend.repository;



import com.adobe.prj.backend.entity.Teacher;
import com.adobe.prj.backend.entity.TeacherEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherEnrollmentRepository extends JpaRepository<TeacherEnrollment, Integer> {
    @Query("SELECT te FROM TeacherEnrollment te WHERE :subjectId = te.subject.id AND :classId = te.clazz.id")
    Optional<TeacherEnrollment> findBySubjectAndClass(@Param("subjectId") int subjectId, @Param("classId") int classId);
//    Optional<TeacherEnrollment> findByTeacherAndClassRoomManagement(Teacher t, ClassRoomManagement cm);
}
