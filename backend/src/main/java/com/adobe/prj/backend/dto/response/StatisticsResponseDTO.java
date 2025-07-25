package com.adobe.prj.backend.dto.response;

import lombok.Data;

@Data
public class StatisticsResponseDTO {
    private long studentsCount;
    private long teachersCount;
    private long adminsCount;
    private long classesCount;

}
