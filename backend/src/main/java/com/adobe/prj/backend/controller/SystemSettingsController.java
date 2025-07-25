package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.request.SystemSettingsRequestDTO;
import com.adobe.prj.backend.dto.response.StatisticsResponseDTO;
import com.adobe.prj.backend.dto.response.SystemSettingsResponseDTO;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/system")
public class SystemSettingsController {
    @Autowired
    private SystemSettingsService systemSettingsService;

    @PostMapping
    public ResponseEntity<SystemSettingsResponseDTO> createSystemSettings(
            @RequestBody SystemSettingsRequestDTO requestDTO) {
        SystemSettingsResponseDTO responseDTO = systemSettingsService.createSystemSettings(requestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<SystemSettingsResponseDTO> getSystemSettings() throws ResourceNotFoundException {
        return ResponseEntity.ok(systemSettingsService.getSystemSettings());
    }


    @PutMapping("/{id}")
    public ResponseEntity<SystemSettingsResponseDTO> updateSystemSettings(
            @PathVariable int id, @RequestBody SystemSettingsRequestDTO requestDTO) throws ResourceNotFoundException {
        return ResponseEntity.ok(systemSettingsService.updateSystemSettings(id, requestDTO));
    }


    @GetMapping("/stats")
    public ResponseEntity<StatisticsResponseDTO> getSiteStatistics() {
        StatisticsResponseDTO stats = systemSettingsService.getSiteStatistics();
        return ResponseEntity.ok(stats);
    }

}
