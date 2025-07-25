package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.timeslot.TimeSlotDTO;
import com.adobe.prj.backend.dto.timetable.TimeTableDTO;
import com.adobe.prj.backend.service.TimeTableService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetables")
public class TimeTableController {

    @Autowired
    private TimeTableService timeTableService;

    @PostMapping
    public ResponseEntity<TimeTableDTO> createTimeTable(@RequestBody TimeTableDTO timeTableDTO) {
        timeTableService.create(timeTableDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<TimeTableDTO>> getTimeTables() {
        List<TimeTableDTO> timeTableDTOList = timeTableService.getAll();
        return new ResponseEntity<>(timeTableDTOList,HttpStatus.OK);
    }
    @PutMapping("/{timeTableId}")
    public ResponseEntity<TimeTableDTO> updateTimeTable(@RequestBody TimeTableDTO timeTableDTO) {
        timeTableService.update(timeTableDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping("/{timeTableId}")
    public ResponseEntity<Void> deleteTimeTable(@PathVariable int timeTableId) {
        timeTableService.delete(timeTableId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
