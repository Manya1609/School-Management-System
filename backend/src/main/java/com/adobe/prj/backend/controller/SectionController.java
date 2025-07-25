package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.section.SectionDTO;
import com.adobe.prj.backend.dto.section.SectionDetailResponse;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
public class SectionController {

    @Autowired
    SectionService sectionService;

    @PostMapping
    public ResponseEntity<SectionDTO> createSection(@RequestBody SectionDTO sectionDTO) {
       SectionDTO response= sectionService.create(sectionDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PutMapping("/{sectionId}")
    public ResponseEntity<SectionDTO> updateSection(@PathVariable int sectionId,@RequestBody SectionDTO sectionDTO) throws ResourceNotFoundException {
       SectionDTO response= sectionService.update(sectionId,sectionDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
    @DeleteMapping("/{sectionId}")
    public ResponseEntity<SectionDTO> deleteSection(@PathVariable int sectionId) throws ResourceNotFoundException {
        sectionService.delete(sectionId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{classId}")  // returns all sections list for the class ID
    public ResponseEntity<List<SectionDTO>> getAllSectionsOfClass(@PathVariable int classId) {
         List<SectionDTO> sectionDTOList = sectionService.getAll(classId);
        return new ResponseEntity<>(sectionDTOList,HttpStatus.OK);
    }

    @GetMapping // Endpoint to get all sections
    public ResponseEntity<List<SectionDTO>> getAllSections() {
        List<SectionDTO> sectionDTOList = sectionService.getAllSections();
        return new ResponseEntity<>(sectionDTOList, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity <SectionDetailResponse> getMySection(@PathVariable int userId) {
        SectionDetailResponse sectionDetailResponse = sectionService.sectionOfUser(userId);
        return new ResponseEntity<>(sectionDetailResponse,HttpStatus.OK);
    }
}
