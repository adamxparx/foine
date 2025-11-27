package com.example.foine.service;

import java.util.Optional;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.foine.dto.LoginDTO;
import com.example.foine.dto.UserDTO;
import com.example.foine.entity.User;
import com.example.foine.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Simple password hashing for demo (NOT secure for production)
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return false;
        }

        String hashedPassword = hashPassword(userDTO.getPassword());
        User user = new User(userDTO.getEmail(), hashedPassword, userDTO.getUsername());
        userRepository.save(user);
        return true;
    }

    public boolean login(LoginDTO loginDTO) {
        return userRepository.findByEmail(loginDTO.getEmail())
            .map(user -> hashPassword(loginDTO.getPassword()).equals(user.getPassword()))
            .orElse(false);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

}
