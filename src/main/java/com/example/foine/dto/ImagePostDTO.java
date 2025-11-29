package com.example.foine.dto;

import java.time.LocalDateTime;

import com.example.foine.entity.ImagePost;

public class ImagePostDTO {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private Long userId;
    private String username;
    private Integer likes;
    private Integer saves;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public ImagePostDTO() {}

    // Constructor from ImagePost entity
    public ImagePostDTO(ImagePost post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.description = post.getDescription();
        this.imageUrl = post.getImageUrl();
        this.userId = post.getUserId();
        this.username = "Unknown"; // Temporarily set to Unknown to avoid lazy loading issues
        this.likes = post.getLikes();
        this.saves = post.getSaves();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }

    public Integer getSaves() { return saves; }
    public void setSaves(Integer saves) { this.saves = saves; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
