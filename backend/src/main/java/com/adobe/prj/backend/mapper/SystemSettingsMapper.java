package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.request.SystemSettingsRequestDTO;
import com.adobe.prj.backend.dto.response.SystemSettingsResponseDTO;
import com.adobe.prj.backend.entity.SystemSettings;
import org.springframework.stereotype.Component;

@Component
public class SystemSettingsMapper {
    public SystemSettings toEntity(SystemSettingsRequestDTO dto) {
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setNameOfSchool(dto.getNameOfSchool());
        systemSettings.setCurrentSession(dto.getCurrentSession());
        systemSettings.setSchoolAcronym(dto.getSchoolAcronym());
        systemSettings.setPhone(dto.getPhone());
        systemSettings.setSchoolEmail(dto.getSchoolEmail());
        systemSettings.setSchoolAddress(dto.getSchoolAddress());
        systemSettings.setTermEnds(dto.getTermEnds());
        systemSettings.setNextTermBegins(dto.getNextTermBegins());
        systemSettings.setLockExam(dto.isLockExam());

        systemSettings.setCrecheFee(dto.getCrecheFee());
        systemSettings.setJuniorSecondaryFee(dto.getJuniorSecondaryFee());
        systemSettings.setNurseryFee(dto.getNurseryFee());
        systemSettings.setPreNurseryFee(dto.getPreNurseryFee());
        systemSettings.setPrimaryFee(dto.getPrimaryFee());
        systemSettings.setSeniorSecondaryFee(dto.getSeniorSecondaryFee());

        return systemSettings;
    }
    public SystemSettingsResponseDTO toDTO(SystemSettings systemSettings) {
        SystemSettingsResponseDTO dto = new SystemSettingsResponseDTO();
        dto.setId(systemSettings.getId());
        dto.setNameOfSchool(systemSettings.getNameOfSchool());
        dto.setCurrentSession(systemSettings.getCurrentSession());
        dto.setSchoolAcronym(systemSettings.getSchoolAcronym());
        dto.setPhone(systemSettings.getPhone());
        dto.setSchoolEmail(systemSettings.getSchoolEmail());
        dto.setSchoolAddress(systemSettings.getSchoolAddress());
        dto.setTermEnds(systemSettings.getTermEnds());
        dto.setNextTermBegins(systemSettings.getNextTermBegins());
        dto.setLockExam(systemSettings.isLockExam());

        dto.setCrecheFee(systemSettings.getCrecheFee());
        dto.setJuniorSecondaryFee(systemSettings.getJuniorSecondaryFee());
        dto.setNurseryFee(systemSettings.getNurseryFee());
        dto.setPreNurseryFee(systemSettings.getPreNurseryFee());
        dto.setPrimaryFee(systemSettings.getPrimaryFee());
        dto.setSeniorSecondaryFee(systemSettings.getSeniorSecondaryFee());

        return dto;
    }
}
