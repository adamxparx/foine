package com.example.foine.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private boolean isPublic;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "board_posts",
        joinColumns = @JoinColumn(name = "board_id"),
        inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private List<ImagePost> posts;

    private LocalDateTime createdAt;

    public Board() {}

    public Board(String name, String description, boolean isPublic, User user) {
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<ImagePost> getPosts() { return posts; }
    public void setPosts(List<ImagePost> posts) { this.posts = posts; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}