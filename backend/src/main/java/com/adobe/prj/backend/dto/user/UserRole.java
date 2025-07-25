package com.adobe.prj.backend.dto.user;


import lombok.Getter;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;

@Getter
@ToString
public enum UserRole{
    SUPER_ADMIN("super_admin"),
    STUDENT("student"),
    ADMIN("admin"),
    TEACHER("teacher");
    private final String value;
    UserRole(String value) {
        this.value = value;
    }
    public String getValue() {
        return value;
    }
    private static final Map<String, UserRole> roleMap = new HashMap<>();
    static {
        for (UserRole role : values()) {
            roleMap.put(role.getValue().toLowerCase(), role); // Store values in lowercase
        }
    }

    public static UserRole fromString(String role) {
        if (role != null) {
            return roleMap.get(role.toLowerCase()); // Handles case insensitivity
        }
        return null;
    }



}
