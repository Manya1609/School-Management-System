package com.adobe.prj.backend.mapper;

import com.adobe.prj.backend.dto.request.NoticeRequestDTO;
import com.adobe.prj.backend.dto.response.NoticeResponseDTO;
import com.adobe.prj.backend.entity.Notice;
import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NoticeMapper {

    @Autowired
    private UserRepository userRepository;
    public Notice toEntity(NoticeRequestDTO dto) {
        Notice notice = new Notice();
        notice.setTitle(dto.getTitle());
        notice.setContent(dto.getContent());
        notice.setDueDate(dto.getDueDate());
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        notice.setUser(user);  // Set the User entity in the Notice entity
        return notice;
    }

    public NoticeResponseDTO toDto(Notice entity) {
        NoticeResponseDTO dto = new NoticeResponseDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setDueDate(entity.getDueDate());
        dto.setUserId(entity.getUser().getUserId());
        return dto;
    }
}
