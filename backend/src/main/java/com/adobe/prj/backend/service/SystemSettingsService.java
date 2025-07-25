package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.request.SystemSettingsRequestDTO;
import com.adobe.prj.backend.dto.response.StatisticsResponseDTO;
import com.adobe.prj.backend.dto.response.SystemSettingsResponseDTO;
import com.adobe.prj.backend.entity.SystemSettings;
import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.SystemSettingsMapper;
import com.adobe.prj.backend.repository.ClassRepository;
import com.adobe.prj.backend.repository.SystemSettingsRepository;
import com.adobe.prj.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SystemSettingsService {
    @Autowired
    private SystemSettingsRepository systemSettingsRepository;

    @Autowired
    private SystemSettingsMapper systemSettingsMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClassRepository classRepository;

    public SystemSettingsResponseDTO createSystemSettings(SystemSettingsRequestDTO requestDTO) {
        SystemSettings systemSettings = systemSettingsMapper.toEntity(requestDTO);
        SystemSettings savedSystemSettings = systemSettingsRepository.save(systemSettings);
        return systemSettingsMapper.toDTO(savedSystemSettings);
    }

    public SystemSettingsResponseDTO getSystemSettings() throws ResourceNotFoundException {
        SystemSettings systemSettings = systemSettingsRepository.findFirstByOrderByIdDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Settings not found"));
        return systemSettingsMapper.toDTO(systemSettings);
    }

    public SystemSettingsResponseDTO updateSystemSettings(int id, SystemSettingsRequestDTO requestDTO) throws ResourceNotFoundException {
        SystemSettings systemSettings = systemSettingsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Settings not found"));
        systemSettings.setNameOfSchool(requestDTO.getNameOfSchool());
        systemSettings.setCurrentSession(requestDTO.getCurrentSession());
        systemSettings.setSchoolAcronym(requestDTO.getSchoolAcronym());
        systemSettings.setPhone(requestDTO.getPhone());
        systemSettings.setSchoolEmail(requestDTO.getSchoolEmail());
        systemSettings.setSchoolAddress(requestDTO.getSchoolAddress());
        systemSettings.setTermEnds(requestDTO.getTermEnds());
        systemSettings.setNextTermBegins(requestDTO.getNextTermBegins());
        systemSettings.setLockExam(requestDTO.isLockExam());

        systemSettings.setCrecheFee(requestDTO.getCrecheFee());
        systemSettings.setJuniorSecondaryFee(requestDTO.getJuniorSecondaryFee());
        systemSettings.setNurseryFee(requestDTO.getNurseryFee());
        systemSettings.setPreNurseryFee(requestDTO.getPreNurseryFee());
        systemSettings.setPrimaryFee(requestDTO.getPrimaryFee());
        systemSettings.setSeniorSecondaryFee(requestDTO.getSeniorSecondaryFee());

        SystemSettings updatedSystemSettings = systemSettingsRepository.save(systemSettings);
        return systemSettingsMapper.toDTO(updatedSystemSettings);
    }

    public StatisticsResponseDTO getSiteStatistics() {
        StatisticsResponseDTO stats = new StatisticsResponseDTO();
        stats.setStudentsCount(userRepository.countStudents());
        stats.setTeachersCount(userRepository.countTeachers());
        stats.setAdminsCount(userRepository.countAdmins());
        stats.setClassesCount(classRepository.countClasses());
        return stats;
    }

}
