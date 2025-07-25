package com.adobe.prj.backend.repository;

import com.adobe.prj.backend.entity.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Integer> {
    Optional<List<StudentEnrollment>> findByStudentId(int userId);
    Optional<List<StudentEnrollment>> findAllByStudentId(int studentId);

    @Query("SELECT se FROM StudentEnrollment se WHERE  se.student.id = :studentId AND  se.section.id = :sectionId AND se.subject.id = :subjectId")
    StudentEnrollment findByData(@Param("studentId") int studentId,@Param("sectionId") int sectionId, @Param("subjectId") int subjectId);

    @Query("SELECT se FROM StudentEnrollment se WHERE :sectionId = se.section.id AND :subjectId = se.subject.id")
    List<StudentEnrollment> findByClassSectionSubject(@Param("sectionId") int sectionId,@Param("subjectId") int subjectId);

    @Query("SELECT se FROM StudentEnrollment se WHERE se.section.id = :sectionId AND  se.student.id = :studentId")
    List<StudentEnrollment> findByStudentSection(@Param("sectionId") int sectionId,@Param("studentId") int studentId);
}
