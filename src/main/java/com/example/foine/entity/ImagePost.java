package com.example.foine.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.FetchType;
import jakarta.persistence.Column;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ImagePost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    @JsonProperty
    private String imageUrl;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "imagePost", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comments> comments;
    
    @OneToMany(mappedBy = "imagePost", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Likes> likes;
    
    @OneToMany(mappedBy = "imagePost", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Saves> saves;

    @ManyToMany(mappedBy = "posts")
    @JsonIgnore
    private List<Board> boards;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PostTag> postTags;

    public ImagePost() {}

    public ImagePost(String title, String description, String imageUrl, User user) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.user = user;
        this.userId = user.getId();
        this.createdAt = LocalDateTime.now();
    }

    public ImagePost(String title, String description, String imageUrl, Long userId) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Comments> getComments() { return comments; }
    public void setComments(List<Comments> comments) { this.comments = comments; }

    public List<Likes> getLikes() { return likes; }
    public void setLikes(List<Likes> likes) { this.likes = likes; }

    public List<Saves> getSaves() { return saves; }
    public void setSaves(List<Saves> saves) { this.saves = saves; }

    public List<Board> getBoards() { return boards; }
    public void setBoards(List<Board> boards) { this.boards = boards; }

    public List<PostTag> getPostTags() { return postTags; }
    public void setPostTags(List<PostTag> postTags) { this.postTags = postTags; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

