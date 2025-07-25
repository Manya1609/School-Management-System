package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.section.SectionDTO;
import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.entity.Section;
import com.adobe.prj.backend.entity.Teacher;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.repository.ClassRepository;
import com.adobe.prj.backend.repository.TeacherRepository;
import com.adobe.prj.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SectionMapper {
    @Autowired
    ClassRepository classRepository;
    @Autowired
    TeacherRepository teacherRepository;

    UserRepository userRepository;

    public Section toEntity(SectionDTO sectionDTO) {
        Section section = new Section();
        section.setId(sectionDTO.getId()); //Not required I guess.
        section.setName(sectionDTO.getName());
        // Check if class exists
        Optional<Class> clazzOptional = classRepository.findById(sectionDTO.getClassId());
        if (!clazzOptional.isPresent()) {
            throw new ResourceNotFoundException("Class not found with id: " + sectionDTO.getClassId());
        }
        section.setClazz(clazzOptional.get());

        // Check if teacher exists
        Optional<Teacher> teacherOptional = teacherRepository.findByUser_UserId(sectionDTO.getUserId());
        if (!teacherOptional.isPresent()) {
            throw new ResourceNotFoundException("Teacher not found with id: " + sectionDTO.getUserId());
        }
        section.setTeacher(teacherOptional.get());
        return section;
    }
    public SectionDTO toDTO(Section section) {
        SectionDTO sectionDTO = new SectionDTO();
        sectionDTO.setId(section.getId());
        sectionDTO.setName(section.getName());
        sectionDTO.setClassId(section.getClazz().getId());
        sectionDTO.setUserId(section.getTeacher().getUser().getUserId());
        return sectionDTO;
    }
}
