package com.adobe.prj.backend.service;

import com.adobe.prj.backend.dto.request.NoticeRequestDTO;
import com.adobe.prj.backend.dto.response.NoticeResponseDTO;
import com.adobe.prj.backend.entity.Notice;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.NoticeMapper;
import com.adobe.prj.backend.repository.NoticeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {
    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private NoticeMapper noticeMapper;

    @Transactional
    public NoticeResponseDTO createNotice(NoticeRequestDTO noticeRequestDTO) {
        Notice notice = noticeMapper.toEntity(noticeRequestDTO);
        Notice savedNotice = noticeRepository.save(notice);
        return noticeMapper.toDto(savedNotice);
    }

    @Transactional
    public NoticeResponseDTO updateNotice(int noticeId, NoticeRequestDTO noticeRequestDTO) throws ResourceNotFoundException {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found"));
        notice.setTitle(noticeRequestDTO.getTitle());
        notice.setContent(noticeRequestDTO.getContent());
        notice.setDueDate(noticeRequestDTO.getDueDate());
        Notice updatedNotice = noticeRepository.save(notice);
        return noticeMapper.toDto(updatedNotice);
    }

    public List<NoticeResponseDTO> getAllNotices() {
        List<Notice> notices = noticeRepository.findAll();
        return notices.stream()
                .map(noticeMapper::toDto)
                .collect(Collectors.toList());
    }


    public NoticeResponseDTO getNoticeById(int noticeId) throws ResourceNotFoundException {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found"));
        return noticeMapper.toDto(notice);
    }

    public void deleteNotice(int noticeId) {
        noticeRepository.deleteById(noticeId);
    }
}
