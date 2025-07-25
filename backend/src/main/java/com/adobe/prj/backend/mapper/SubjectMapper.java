package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.request.SubjectRequestDTO;
import com.adobe.prj.backend.dto.response.SubjectResponseDTO;
import com.adobe.prj.backend.dto.response.UserResponseDTO;
import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.entity.Subject;
import com.adobe.prj.backend.entity.Teacher;
import com.adobe.prj.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapper {
    public Subject toEntity(SubjectRequestDTO dto){
        Subject subject = new Subject();
        subject.setSubjectName(dto.getSubjectName());
        subject.setShortName(dto.getShortName());

        return subject;
    };
    public SubjectResponseDTO toDto(Subject subject){
        SubjectResponseDTO dto = new SubjectResponseDTO();
        dto.setSubjectId(subject.getId());
        dto.setSubjectName(subject.getSubjectName());
        dto.setShortName(subject.getShortName());
        // Set class name
        Class clazz = subject.getClazz();
        if (clazz != null) {
            dto.setClassId(clazz.getId());
            dto.setClassName(clazz.getName()); // Adjust method name if needed
        }

        // Set teacher name
        Teacher teacher = subject.getTeacher();
        if (teacher != null) {
            User teacherUser = teacher.getUser();
            if (teacherUser != null) {
                dto.setUserId(teacherUser.getUserId());
                dto.setTeacherName(teacherUser.getFullName());
                dto.setTeacherEmail(teacherUser.getEmail());// Adjust method name if needed
            }
        }

        return dto;
    }
}
