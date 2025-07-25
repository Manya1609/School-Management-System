package com.adobe.prj.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class NoticeRequestDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private Date dueDate;

    private int userId;

}
