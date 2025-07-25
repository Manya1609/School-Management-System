package com.adobe.prj.backend.dto.Class;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassDTO {
    private int id;

    private String name;

    private String classType;
}
