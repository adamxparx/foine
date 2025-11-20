package com.example.foine.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<ImagePost> posts;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comments> comments;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Likes> likes;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Saves> saves;

    public User() {}

    public User(String email, String password, String username) {
        this.email = email;
        this.password = password;
        this.username = username;
    }
    
    public void setId(Long id) { this.id = id; }
    public Long getId() { return id; }

    public void setEmail(String email) { this.email = email; }
    public String getEmail() { return email; }
    
    public void setPassword(String password) { this.password = password; }
    public String getPassword() { return password; }

    public void setUsername(String username) { this.username = username; }
    public String getUsername() { return username; }

    public List<ImagePost> getPosts() { return posts; }
    public void setPosts(List<ImagePost> posts) { this.posts = posts; }

    public List<Comments> getComments() { return comments; }
    public void setComments(List<Comments> comments) { this.comments = comments; }

    public List<Likes> getLikes() { return likes; }
    public void setLikes(List<Likes> likes) { this.likes = likes; }

    public List<Saves> getSaves() { return saves; }
    public void setSaves(List<Saves> saves) { this.saves = saves; }
}
