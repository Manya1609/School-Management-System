package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestParam("username") String username,
                                                @RequestParam("newPassword") String newPassword) throws ResourceNotFoundException {
        passwordResetService.resetPassword(username, newPassword);
        return new ResponseEntity<>("Password has been reset successfully", HttpStatus.OK);
    }
}
