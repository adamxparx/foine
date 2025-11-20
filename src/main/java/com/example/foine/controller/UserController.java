package com.example.foine.controller;

import java.util.Map;

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
import com.example.foine.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return ResponseEntity.status(400).body("Email already exist.");
        }
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            return ResponseEntity.status(400).body("Username already exists.");
        }
        
        String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
        User user = new User(userDTO.getEmail(), hashedPassword, userDTO.getUsername());
        userRepository.save(user);
        return ResponseEntity.ok(
            Map.of("userId", user.getId(), "email", user.getEmail(), "username", user.getUsername())
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail()).orElse(null);
        if (user == null || !passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials.");
        }
        return ResponseEntity.ok(
            Map.of("userId", user.getId(), "email", user.getEmail(), "username", user.getUsername())
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Successfully logged out.");
    }
    
}
