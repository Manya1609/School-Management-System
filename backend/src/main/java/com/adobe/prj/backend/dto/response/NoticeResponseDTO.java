package com.adobe.prj.backend.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class NoticeResponseDTO {
    private int id;
    private String title;
    private String content;
    private Date dueDate;
    private int userId;
}
