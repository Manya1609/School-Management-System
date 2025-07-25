package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.student.StudentDTO;
import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.entity.Student;
import com.adobe.prj.backend.repository.ClassRepository;
import com.adobe.prj.backend.repository.SectionRepository;
import com.adobe.prj.backend.repository.StudentRepository;
import com.adobe.prj.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StudentMapper {

    @Autowired
    ClassRepository classRepository;

    @Autowired
    SectionRepository sectionRepository;

    @Autowired
    UserRepository userRepository;

    public Student toEntity(StudentDTO studentDTO) {
        Student student = new Student();
        int classId = studentDTO.getClassId();
        Optional<Class> clazz = classRepository.findById(classId);
        if(!clazz.isPresent()) {
            System.out.println("Class not found@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            return student;
        }
//        student.(studentDTO.getUserId()); //Not required I guess.

        student.setDormitory(studentDTO.getDormitory());
        student.setClazz(clazz.get());
        student.setParent(studentDTO.getParent());
        student.setSection(sectionRepository.findById(studentDTO.getSectionId()).get());
        student.setUser(userRepository.findById(studentDTO.getUserId()).get());
//        student.setId(student.getUser().getUserId());
        student.setAdmissionNumber(studentDTO.getAdmissionNumber());
        student.setDormitoryNumber(studentDTO.getDormitoryNumber());
        student.setSportsHouse(studentDTO.getSportsHouse());
        student.setYearAdmitted(studentDTO.getYearAdmitted());
        return student;
    }
    public StudentDTO toDTO(Student student) {
        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setUserId(student.getUser().getUserId());
        studentDTO.setDormitory(student.getDormitory());
        studentDTO.setClassId(student.getClazz().getId());
        studentDTO.setParent(student.getParent());
        studentDTO.setSectionId(student.getSection().getId());
        studentDTO.setUserId(student.getUser().getUserId());
        studentDTO.setAdmissionNumber(student.getAdmissionNumber());
        studentDTO.setDormitoryNumber(student.getDormitoryNumber());
        studentDTO.setSportsHouse(student.getSportsHouse());
        studentDTO.setYearAdmitted(student.getYearAdmitted());
        return studentDTO;
    }
}
