package com.adobe.prj.backend.dto.response;

import com.adobe.prj.backend.dto.user.UserRole;
import lombok.Data;
import java.util.Date;


@Data
public class UserResponseDTO {
    private int userId;
    private String role;
    private String fullName;
    private String address;
    private String email;
    private String username;
    private String phone;
    private String telephone;
    private Date dateOfEmployment;
    private String gender;
    private String nationality;
    private String state;
    private String lga;
    private String bloodGroup;
    private Date dob;
    //    private byte[] passportPhoto;
}
