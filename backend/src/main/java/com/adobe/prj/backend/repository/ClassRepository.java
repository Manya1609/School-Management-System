package com.adobe.prj.backend.repository;

import com.adobe.prj.backend.entity.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class,Integer> {
//    Optional<Class> findById(int classId);

    @Query("SELECT COUNT(c) FROM Class c")
    long countClasses();
}
