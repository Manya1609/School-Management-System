package com.adobe.prj.backend.dto.request;


import lombok.Data;

import java.util.Date;

@Data
public class UserRequestDTO {
    private String role;
    private String fullName;
    private String address;
    private String email;
    private String username;
    private String password;
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
