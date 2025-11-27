package com.example.foine.dto;

public class UserDTO {
    private Long id;
    private String email;
    private String password;
    private String username;

    public UserDTO() {}

    public UserDTO(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public void setEmail(String email) { this.email = email; }
    public String getEmail() { return email; }

    public void setPassword(String password) { this.password = password; }
    public String getPassword() { return password; }

    public void setUsername(String username) { this.username = username; }
    public String getUsername() { return username; }
}
