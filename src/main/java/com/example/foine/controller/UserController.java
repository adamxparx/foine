package com.example.foine.controller;

import java.util.Map;
import java.util.HashMap;

import com.example.foine.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.foine.dto.LoginDTO;
import com.example.foine.dto.UserDTO;
import com.example.foine.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        boolean success = userService.register(userDTO);
        if (!success) {
            return ResponseEntity.status(400).body("Email already exists.");
        }

        User savedUser = userService.getUserByEmail(userDTO.getEmail());
        Map<String, Object> response = new HashMap<>();
        response.put("userId", savedUser.getId());
        response.put("email", savedUser.getEmail());
        response.put("username", savedUser.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        boolean success = userService.login(loginDTO);
        if (!success) {
            return ResponseEntity.status(401).body("Invalid credentials.");
        }

        User user = userService.getUserByEmail(loginDTO.getEmail());
        return ResponseEntity.ok(
            Map.of("userId", user.getId(), "email", user.getEmail(), "username", user.getUsername())
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Successfully logged out.");
    }

}
