package com.adobe.prj.backend.repository;


import com.adobe.prj.backend.entity.Teacher;
import com.adobe.prj.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
    Optional<Teacher> findByUser(Optional<User> user);
    Optional<Teacher> findById(int id);
    Optional<Teacher> findByUser_UserId(int userId);
}
