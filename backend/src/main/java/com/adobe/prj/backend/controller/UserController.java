package com.adobe.prj.backend.controller;

import com.adobe.prj.backend.dto.request.UserRequestDTO;
import com.adobe.prj.backend.dto.response.UserResponseDTO;
import com.adobe.prj.backend.dto.response.UserRoleListDTO;
import com.adobe.prj.backend.exceptions.ResourceNotFoundException;
import com.adobe.prj.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable int id) throws ResourceNotFoundException {
        UserResponseDTO userResponseDto = userService.getUserById(id);
        return ResponseEntity.ok(userResponseDto);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> userResponseDtos = userService.getAllUsers();
        return ResponseEntity.ok(userResponseDtos);
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO userRequestDto) {
        UserResponseDTO userResponseDto = userService.createUser(userRequestDto);
        return ResponseEntity.ok(userResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable int id, @RequestBody UserResponseDTO userRequestDto) throws ResourceNotFoundException {
        UserResponseDTO userResponseDto = userService.updateUser(id, userRequestDto);
        return ResponseEntity.ok(userResponseDto);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserRoleListDTO>> getUsersByRole(@PathVariable String role) {
        List<UserRoleListDTO> userResponseDTOs = userService.getUsersByRole(role);
        return ResponseEntity.ok(userResponseDTOs);
    }

    @GetMapping("/by-teacher/{teacherId}")
    public ResponseEntity<UserResponseDTO> getUserByTeacherId(@PathVariable int teacherId) throws ResourceNotFoundException {
        UserResponseDTO userResponse = userService.getUserByTeacherId(teacherId);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

}
