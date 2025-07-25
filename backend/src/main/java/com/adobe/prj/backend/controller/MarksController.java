package com.adobe.prj.backend.controller;


import com.adobe.prj.backend.dto.marks.MarksDTO;
import com.adobe.prj.backend.dto.marks.TabulationData;
import com.adobe.prj.backend.entity.Marks;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.MarksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    @Autowired
    MarksService marksService;

    @PostMapping("/classes/{classId}/sections/{sectionId}/subjects/{subjectId}/exams/{examId}/marks")
    public ResponseEntity<Void> postMarks(@RequestBody List<MarksDTO> marksDTOList, @PathVariable("classId") int classId, @PathVariable("sectionId") int sectionId, @PathVariable("subjectId") int subjectId, @PathVariable("examId") int examId){
        marksService.addMarks(marksDTOList,examId,classId,sectionId,subjectId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/classes/{classId}/sections/{sectionId}/subjects/{subjectId}/exams/{examId}/marks")
    public ResponseEntity<List<MarksDTO>> getAllMarks(@PathVariable("examId") int examId, @PathVariable("sectionId") int sectionId, @PathVariable("classId") int classId, @PathVariable("subjectId") int subjectId){
        List<MarksDTO> marksDTOList = marksService.getMarks(examId,sectionId,classId,subjectId);
        return new ResponseEntity<>(marksDTOList,HttpStatus.OK);
    }

    @PutMapping("/classes/{classId}/sections/{sectionId}/subjects/{subjectId}/exams/{examId}/marks")
    public ResponseEntity<Void> updateMarks(@RequestBody List<MarksDTO> marksDTOList,@PathVariable int classId, @PathVariable int sectionId, @PathVariable int subjectId, @PathVariable int examId){
        marksService.update(marksDTOList,examId,classId,sectionId,subjectId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/total")
    public ResponseEntity<List<TabulationData>> getTotalMarks(@RequestParam int examId, @RequestParam int sectionId, @RequestParam int classId) throws ResourceNotFoundException {
        List<TabulationData> tabulationDataList = marksService.getTabulation(examId,sectionId,classId);
        return new ResponseEntity<>(tabulationDataList,HttpStatus.OK);
    }


}
