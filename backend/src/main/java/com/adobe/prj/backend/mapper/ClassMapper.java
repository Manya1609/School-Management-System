package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.Class.ClassDTO;
import com.adobe.prj.backend.entity.Class;
import org.springframework.stereotype.Component;

@Component
public class ClassMapper {
    public Class toEntity(ClassDTO classDTO) {
        Class clazz = new Class();
        clazz.setId(classDTO.getId()); // Not required I guess.
        clazz.setName(classDTO.getName());
        clazz.setClassType(classDTO.getClassType());
        return clazz;
    }

    public ClassDTO toDTO(Class clazz) {
        ClassDTO classDTO = new ClassDTO();
        classDTO.setId(clazz.getId());
        classDTO.setName(clazz.getName());
        classDTO.setClassType(clazz.getClassType());
        return classDTO;
    }
}
