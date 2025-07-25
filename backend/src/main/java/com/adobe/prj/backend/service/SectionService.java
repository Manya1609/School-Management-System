package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.section.SectionDTO;
import com.adobe.prj.backend.dto.section.SectionDetailResponse;
import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.entity.Section;
import com.adobe.prj.backend.entity.Student;
import com.adobe.prj.backend.entity.Teacher;
import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.SectionMapper;
import com.adobe.prj.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SectionService {
    @Autowired
    SectionRepository sectionRepository;

    @Autowired
    SectionMapper sectionMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ClassRepository classRepository;

    public SectionDTO create(SectionDTO sectionDTO) {
        Section section=sectionRepository.save(sectionMapper.toEntity(sectionDTO));
        return sectionMapper.toDTO(section);
    }

    public SectionDTO update(int sectionId,SectionDTO sectionDTO) {
        Optional<Section> sectionOpt = sectionRepository.findById(sectionId);
        if(sectionOpt.isPresent()){
           Section section=sectionOpt.get();
           section.setName(sectionDTO.getName());
           section.setClazz(classRepository.findById(sectionDTO.getClassId()).get());
           section.setTeacher(teacherRepository.findByUser_UserId(sectionDTO.getUserId()).get());
           Section updatedSection=sectionRepository.save(section);
           return sectionMapper.toDTO(updatedSection);
        }
        else{
           throw new ResourceNotFoundException("Section Not Found");
        }

    }

    public void delete(int sectionId) {
        Optional<Section> section = sectionRepository.findById(sectionId);
        if(section.isPresent()) {
            sectionRepository.deleteById(sectionId);
        }
        else{
            throw new ResourceNotFoundException("Section Not Found");
        }
    }

    public SectionDetailResponse sectionOfUser(int userId) { //The user must exist in the db to call this method.
        User user = userRepository.getReferenceById(userId);
        if(UserRole.STUDENT.equals(user.getRole())){
            SectionDetailResponse sectionDetailResponse = new SectionDetailResponse();
            Student student = studentRepository.getReferenceById(user.getUserId());
            sectionDetailResponse.setSectionId(student.getSection().getId());
            sectionDetailResponse.setSectionName(student.getSection().getName());
            sectionDetailResponse.setClassId(student.getClazz().getId());
            sectionDetailResponse.setClassName(student.getClazz().getName());
            sectionDetailResponse.setTeacherName(student.getSection().getTeacher().getUser().getUserName());
            return sectionDetailResponse;
        }
        else if(UserRole.TEACHER.equals(user.getRole())){
            SectionDetailResponse sectionDetailResponse = new SectionDetailResponse();
            Teacher teacher = teacherRepository.findByUser(Optional.of(user)).get();
            Section section = teacher.getSection();
            sectionDetailResponse.setSectionId(section.getId());
            sectionDetailResponse.setSectionName(section.getName());
            sectionDetailResponse.setClassId(section.getClazz().getId());
            sectionDetailResponse.setClassName(section.getClazz().getName());
            sectionDetailResponse.setTeacherName(teacher.getUser().getUserName());
            return sectionDetailResponse;

        }// add else case here
        return null;
    }

    public List<SectionDTO> getAll(int classId) {
        List<SectionDTO> sectionDTOList = sectionRepository.findAllByClazzId(classId).stream().map(sectionMapper::toDTO).collect(Collectors.toList());
        return sectionDTOList;
    }

    public List<SectionDTO> getAllSections() {
        return sectionRepository.findAll().stream().map(sectionMapper::toDTO).collect(Collectors.toList());
    }
}
