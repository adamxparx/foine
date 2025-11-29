package com.example.foine.service;

import com.example.foine.entity.User;
import com.example.foine.repository.UserRepository;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(String email, String password) throws Exception {
        // Validation
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        // Check if already registered
        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser != null) {
            throw new IllegalArgumentException("Email already registered");
        }

        try {
            User newUser = new User();
            newUser.setEmail(email);
            
            // Handle username: generate unique one from email + UUID suffix
            String username = email.split("@")[0] + "_" + UUID.randomUUID().toString().substring(0, 8);
            newUser.setUsername(username);
            
            newUser.setPassword(passwordEncoder.encode(password));

            User savedUser = userRepository.save(newUser);
            return savedUser;
        } catch (Exception e) {
            throw new RuntimeException("Registration failed: " + e.getMessage(), e);
        }
    }

    public User login(String email, String password) throws Exception {
        if (email == null || password == null) {
            throw new IllegalArgumentException("Email and password required");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return user;
    }

    public User getUserById(Long id) {
        if (id == null) {
            return null;
        }
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        if (email == null) {
            return null;
        }
        return userRepository.findByEmail(email).orElse(null);
    }
}
