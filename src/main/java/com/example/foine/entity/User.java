package com.example.foine.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    public User() {}

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    public void setId(Long id) { this.id = id; }
    public Long getId() { return id; }

    public void setEmail(String email) { this.email = email; }
    public String getEmail() { return email; }
    
    public void setPassword(String password) { this.password = password; }
    public String getPassword() { return password; }
}
