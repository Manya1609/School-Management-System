package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.timeslot.TimeSlotDTO;
import com.adobe.prj.backend.service.TimeSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TimeSlotController {

    @Autowired
    private TimeSlotService timeSlotService;

    @PostMapping("/timeslots")
    public ResponseEntity<TimeSlotDTO> createTimeSlot(@RequestBody TimeSlotDTO timeSlotDTO) {
        timeSlotService.create(timeSlotDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/timeslots")
    public ResponseEntity<List<TimeSlotDTO>> getAllTimeSlots() {
        List<TimeSlotDTO> timeSlotDTOList = timeSlotService.getAll();
        return new ResponseEntity<>(timeSlotDTOList,HttpStatus.OK);
    }

    @PutMapping("/timeslots/{timeSlotId}")
    public ResponseEntity<TimeSlotDTO> updateTimeSlot(@RequestBody TimeSlotDTO timeSlotDTO) {
        timeSlotService.update(timeSlotDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/timeslots/{timeSlotId}")
    public ResponseEntity<TimeSlotDTO> deleteTimeSlot(@PathVariable int timeSlotId) {
        timeSlotService.delete(timeSlotId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}
