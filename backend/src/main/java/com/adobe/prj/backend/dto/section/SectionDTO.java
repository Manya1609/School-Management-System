package com.adobe.prj.backend.dto.section;

import com.adobe.prj.backend.entity.Class;
import com.adobe.prj.backend.entity.Teacher;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SectionDTO {

    private int id;


    private int classId;


    private String name;


    private int userId;
}
