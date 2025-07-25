package com.adobe.prj.backend.service;

import com.adobe.prj.backend.entity.User;
import com.adobe.prj.backend.dto.user.UserRole;
import com.adobe.prj.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Service
public class SuperAdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void createSuperAdminIfNotExists() {
        try {
            Optional<List<User>> superAdminOpt = userRepository.findByRole(UserRole.SUPER_ADMIN);
            List<User> users = superAdminOpt.orElse(Collections.emptyList()).stream()
                    .toList();
            System.out.println("Hello");

            if (users.isEmpty()) {
                // Create and save a new super admin
                User superAdmin = new User();
                superAdmin.setUserName("superAdmin");
                superAdmin.setEmail("superadmin@nps.com");
                superAdmin.setFullName("SUPER ADMIN");
                superAdmin.setRole(UserRole.SUPER_ADMIN);// Define your super admin username
                superAdmin.setPassword(new BCryptPasswordEncoder().encode("superadmin")); // Define your super admin password

                System.out.println(superAdmin);
                userRepository.save(superAdmin);
            }
        } catch (Exception e) {
            e.printStackTrace(); // Print the exception stack trace
            throw new RuntimeException("Failed to create Super Admin", e);
        }
    }

    }

