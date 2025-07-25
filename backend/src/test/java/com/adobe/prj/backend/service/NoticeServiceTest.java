package com.adobe.prj.backend.service;


import com.adobe.prj.backend.dto.request.NoticeRequestDTO;
import com.adobe.prj.backend.dto.response.NoticeResponseDTO;
import com.adobe.prj.backend.entity.Notice;
import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.mapper.NoticeMapper;
import com.adobe.prj.backend.repository.NoticeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class NoticeServiceTest {

    @Mock
    private NoticeRepository noticeRepository;

    @Mock
    private NoticeMapper noticeMapper;

    @InjectMocks
    private NoticeService noticeService;

    private Notice notice;
    private NoticeRequestDTO noticeRequestDTO;
    private NoticeResponseDTO noticeResponseDTO;
    private User user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setUserId(1);

        notice = new Notice();
        notice.setId(1);
        notice.setTitle("Test Notice");
        notice.setContent("Test Content");
        notice.setDueDate(new Date());
        notice.setUser(user);

        noticeRequestDTO = new NoticeRequestDTO();
        noticeRequestDTO.setTitle("Test Notice");
        noticeRequestDTO.setContent("Test Content");
        noticeRequestDTO.setDueDate(new Date());
        noticeRequestDTO.setUserId(1);

        noticeResponseDTO = new NoticeResponseDTO();
        noticeResponseDTO.setId(1);
        noticeResponseDTO.setTitle("Test Notice");
        noticeResponseDTO.setContent("Test Content");
        noticeResponseDTO.setDueDate(new Date());
        noticeResponseDTO.setUserId(1);
    }
    @Test
    public void testCreateNotice() {
        when(noticeMapper.toEntity(any(NoticeRequestDTO.class))).thenReturn(notice);
        when(noticeRepository.save(any(Notice.class))).thenReturn(notice);
        when(noticeMapper.toDto(any(Notice.class))).thenReturn(noticeResponseDTO);

        NoticeResponseDTO response = noticeService.createNotice(noticeRequestDTO);

        assertNotNull(response);
        assertEquals("Test Notice", response.getTitle());
        verify(noticeRepository, times(1)).save(any(Notice.class));
    }

    @Test
    public void testUpdateNotice() throws ResourceNotFoundException {
        when(noticeRepository.findById(1)).thenReturn(Optional.of(notice));
        when(noticeRepository.save(any(Notice.class))).thenReturn(notice);
        when(noticeMapper.toDto(any(Notice.class))).thenReturn(noticeResponseDTO);

        NoticeResponseDTO response = noticeService.updateNotice(1, noticeRequestDTO);

        assertNotNull(response);
        assertEquals("Test Notice", response.getTitle());
        verify(noticeRepository, times(1)).save(any(Notice.class));
    }
    @Test
    public void testUpdateNoticeNotFound() {
        when(noticeRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            noticeService.updateNotice(1, noticeRequestDTO);
        });
    }

    @Test
    public void testGetAllNotices() {
        when(noticeRepository.findAll()).thenReturn(Arrays.asList(notice));
        when(noticeMapper.toDto(any(Notice.class))).thenReturn(noticeResponseDTO);

        List<NoticeResponseDTO> response = noticeService.getAllNotices();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals("Test Notice", response.get(0).getTitle());
        verify(noticeRepository, times(1)).findAll();
    }

    @Test
    public void testGetNoticeById() throws ResourceNotFoundException {
        when(noticeRepository.findById(1)).thenReturn(Optional.of(notice));
        when(noticeMapper.toDto(any(Notice.class))).thenReturn(noticeResponseDTO);

        NoticeResponseDTO response = noticeService.getNoticeById(1);

        assertNotNull(response);
        assertEquals("Test Notice", response.getTitle());
        verify(noticeRepository, times(1)).findById(1);
    }

    @Test
    public void testGetNoticeByIdNotFound() {
        when(noticeRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            noticeService.getNoticeById(1);
        });
    }

    @Test
    public void testDeleteNotice() {
        noticeService.deleteNotice(1);
        verify(noticeRepository, times(1)).deleteById(1);
    }
}
