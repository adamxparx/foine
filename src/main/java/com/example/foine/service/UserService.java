package com.example.foine.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.foine.dto.LoginDTO;
import com.example.foine.dto.UserDTO;
import com.example.foine.entity.User;
import com.example.foine.repository.UserRepository;

@Service
public class UserService {
 
    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            return false;
        }

        String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
        User user = new User(userDTO.getEmail(), hashedPassword, userDTO.getUsername());
        userRepository.save(user);
        return true;
    }

    public boolean login(LoginDTO loginDTO) {
        return userRepository.findByEmail(loginDTO.getEmail())
            .map(user -> passwordEncoder.matches(loginDTO.getPassword(), user.getPassword()))
            .orElse(false);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

}
