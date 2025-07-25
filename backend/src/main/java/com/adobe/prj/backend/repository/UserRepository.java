package com.adobe.prj.backend.repository;

import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<List<User>> findByRole(UserRole role);
    Optional<User> findByUserId(int id);
    Optional<User> findByUserName(String username);
    Optional<List<User>> findFirstByRole(UserRole userRole);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STUDENT'")
    long countStudents();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'TEACHER'")
    long countTeachers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'ADMIN'")
    long countAdmins();
}
