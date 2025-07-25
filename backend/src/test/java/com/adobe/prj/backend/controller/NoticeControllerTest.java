package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.request.NoticeRequestDTO;
import com.adobe.prj.backend.dto.response.NoticeResponseDTO;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.NoticeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
public class NoticeControllerTest {
    @Mock
    private NoticeService noticeService;

    @InjectMocks
    private NoticeController noticeController;

    private NoticeRequestDTO noticeRequestDTO;
    private NoticeResponseDTO noticeResponseDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

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
        when(noticeService.createNotice(any(NoticeRequestDTO.class))).thenReturn(noticeResponseDTO);

        ResponseEntity<NoticeResponseDTO> response = noticeController.createNotice(noticeRequestDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Test Notice", response.getBody().getTitle());
        verify(noticeService, times(1)).createNotice(any(NoticeRequestDTO.class));
    }

    @Test
    public void testUpdateNotice() throws ResourceNotFoundException {
        when(noticeService.updateNotice(anyInt(), any(NoticeRequestDTO.class))).thenReturn(noticeResponseDTO);

        ResponseEntity<NoticeResponseDTO> response = noticeController.updateNotice(1, noticeRequestDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Test Notice", response.getBody().getTitle());
        verify(noticeService, times(1)).updateNotice(anyInt(), any(NoticeRequestDTO.class));
    }

    @Test
    public void testGetAllNotices() {
        when(noticeService.getAllNotices()).thenReturn(Arrays.asList(noticeResponseDTO));

        ResponseEntity<List<NoticeResponseDTO>> response = noticeController.getAllNotices();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(noticeService, times(1)).getAllNotices();
    }

    @Test
    public void testGetNoticeById() throws ResourceNotFoundException {
        when(noticeService.getNoticeById(anyInt())).thenReturn(noticeResponseDTO);

        ResponseEntity<NoticeResponseDTO> response = noticeController.getNoticeById(1);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Test Notice", response.getBody().getTitle());
        verify(noticeService, times(1)).getNoticeById(anyInt());
    }
    @Test
    public void testDeleteNotice() {
        ResponseEntity<Void> response = noticeController.deleteNotice(1);

        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(noticeService, times(1)).deleteNotice(anyInt());
    }
}
