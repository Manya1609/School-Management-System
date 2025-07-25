package com.adobe.prj.backend.repository;

import com.adobe.prj.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    Optional<List<Subject>> findByTeacher_User_userId(int teacherId);
}
