package com.adobe.prj.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserDTO {
    private int userId;
    private String email;
    private String userName;

    private String password;
    private String fullName;

    private Date dob;

    private String gender;
    private String address;
    private String phone;
    private String telephone;
    private String role;

    private Date dateOfEmployment;

    private String nationality;

    private String state;

    private String lga;//local government area

    private String bloodGroup;

    private byte[] photo;
}
