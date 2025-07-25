package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.request.NoticeRequestDTO;
import com.adobe.prj.backend.dto.response.NoticeResponseDTO;
import com.adobe.prj.backend.dto.response.SubjectResponseDTO;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {
    @Autowired
    private NoticeService noticeService;

    @PostMapping
    public ResponseEntity<NoticeResponseDTO> createNotice(@RequestBody NoticeRequestDTO noticeRequestDTO) {
        NoticeResponseDTO responseDTO = noticeService.createNotice(noticeRequestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{noticeId}")
    public ResponseEntity<NoticeResponseDTO> updateNotice(@PathVariable("noticeId") int noticeId,
                                          @RequestBody NoticeRequestDTO noticeRequestDTO) throws ResourceNotFoundException {
        NoticeResponseDTO responseDTO = noticeService.updateNotice(noticeId, noticeRequestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<NoticeResponseDTO>> getAllNotices() {
        List<NoticeResponseDTO> responseDTOs = noticeService.getAllNotices();
        return new ResponseEntity<>(responseDTOs, HttpStatus.OK);
    }

    @GetMapping("/{noticeId}")
    public ResponseEntity<NoticeResponseDTO> getNoticeById(@PathVariable("noticeId") int noticeId) throws ResourceNotFoundException {
        NoticeResponseDTO notice = noticeService.getNoticeById(noticeId);
        return ResponseEntity.ok(notice);
    }

    @DeleteMapping("/{noticeId}")
    public ResponseEntity<Void> deleteNotice(@PathVariable("noticeId") int noticeId) {
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.noContent().build();
    }


}
