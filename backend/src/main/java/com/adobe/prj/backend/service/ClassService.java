package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.Class.ClassDTO;
import com.adobe.prj.backend.dto.section.SectionDTO;
import com.adobe.prj.backend.dto.student.StudentDTO;
import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.entity.Section;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.ClassMapper;
import com.adobe.prj.backend.mapper.SectionMapper;
import com.adobe.prj.backend.mapper.StudentMapper;
import com.adobe.prj.backend.repository.ClassRepository;
import com.adobe.prj.backend.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClassService {
    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private ClassMapper classMapper;

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private SectionMapper sectionMapper;

    public ClassDTO create(ClassDTO classDTO) {
       Class clazz= classRepository.save(classMapper.toEntity(classDTO));
        return classMapper.toDTO(clazz);
    }

    public List<StudentDTO> getStudentsOfClass(int classId) {
        Optional<Class> clazz = classRepository.findById(classId);
        if(clazz.isPresent()){
            List<StudentDTO> studentDTOList = clazz.get().getStudentList().stream().map(studentMapper::toDTO).collect(Collectors.toList());
            return studentDTOList;
        }
        else{
            System.out.println("Class not found");
            return null;
        }



    }

    public List<StudentDTO> getStudentsOfClassSection(int classId, int sectionId) {
        Optional<Section> section = sectionRepository.findById(sectionId);
        if(section.isPresent()){
            List<StudentDTO> studentDTOList = section.get().getStudentList().stream().map(studentMapper::toDTO).collect(Collectors.toList());
            return studentDTOList;
        }
        else{
            System.out.println("Section not found");
            return null;
        }

    }

    public ClassDTO update(int classId,ClassDTO classDTO) {
        Optional<Class> existingClassOpt = classRepository.findById(classId);

        if (existingClassOpt.isPresent()) {
            Class existingClass = existingClassOpt.get();

            existingClass.setName(classDTO.getName());
            existingClass.setClassType(classDTO.getClassType());

            Class updatedClass = classRepository.save(existingClass);

            return classMapper.toDTO(updatedClass);
        } else {
            throw new ResourceNotFoundException("Class not found");
        }
    }

    public void delete(int classId) {
        classRepository.deleteById(classId);
    }

    public List<SectionDTO> getSectionsOfClass(int classId) {
        Optional<Class> clazz = classRepository.findById(classId);
        if(clazz.isPresent()){
            List<Section> sectionList = clazz.get().getSectionList();
            List<SectionDTO> sectionDTOList = sectionList.stream().map(sectionMapper::toDTO).collect(Collectors.toList());
            return sectionDTOList;
        }
        else{
            System.out.println("Class not found");
            return null;
        }

    }

    public List<ClassDTO> getAllClasses() {
        return classRepository.findAll().stream().map(classMapper::toDTO).collect(Collectors.toList());
    }

    public ClassDTO getClassById(int id){
        return classRepository.findById(id)
                .map(classMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
    }
}
