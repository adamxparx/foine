package com.example.foine.controller;

import java.util.Map;
import java.util.UUID;

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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {

        boolean success = userService.register(userDTO);

        if (!success) {
            return ResponseEntity.badRequest().body("Email already exist.");
        }
        
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {

        boolean success = userService.login(loginDTO);

        if (!success) {
            return ResponseEntity.status(401).body("Invalid credentials.");
        }

        String token = UUID.randomUUID().toString();

        return ResponseEntity.ok(
            Map.of("token", token)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Successfully logged out.");
    }
    
}
