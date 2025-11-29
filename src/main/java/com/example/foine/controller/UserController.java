package com.example.foine.controller;

import com.example.foine.dto.LoginDTO;
import com.example.foine.dto.UserDTO;
import com.example.foine.entity.User;
import com.example.foine.service.UserService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            User newUser = userService.register(userDTO.getEmail(), userDTO.getPassword());
            return ResponseEntity.status(201).body(Map.of(
                "success", true,
                "message", "Registration successful",
                "userId", newUser.getId(),
                "email", newUser.getEmail()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            User user = userService.login(loginDTO.getEmail(), loginDTO.getPassword());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "userId", user.getId(),
                "email", user.getEmail()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Sessions are stateless (no session store), so logout is just client-side
        // (Clear localStorage on frontend)
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUser(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "email", user.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
