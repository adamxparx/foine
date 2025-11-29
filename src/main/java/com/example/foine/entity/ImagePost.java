package com.example.foine.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "image_posts", indexes = {
    @Index(name = "idx_image_post_user_id", columnList = "user_id"),
    @Index(name = "idx_image_post_created_at", columnList = "created_at"),
    @Index(name = "idx_image_post_title_desc", columnList = "title, description")
})
public class ImagePost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    @Column(nullable = false, length = 255)
    private String title;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    @Column(length = 1000)
    private String description;

    @NotBlank(message = "Image URL is required")
    @Column(name = "image_url", nullable = false, length = 1000)
    @JsonProperty("imageUrl")
    private String imageUrl;

    @NotNull(message = "User ID is required")
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Integer likes = 0;

    @Column(nullable = false)
    private Integer saves = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "imagePost", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comments> comments;

    @OneToMany(mappedBy = "imagePost", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Likes> likesList;

    @OneToMany(mappedBy = "imagePost", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Saves> savesList;

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
        this.updatedAt = LocalDateTime.now();
        this.likes = 0;
        this.saves = 0;
    }

    public ImagePost(String title, String description, String imageUrl, Long userId) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.likes = 0;
        this.saves = 0;
    }

    // Pre-persist callback to set timestamps
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

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

    public List<Likes> getLikesList() { return likesList; }
    public void setLikesList(List<Likes> likesList) { this.likesList = likesList; }

    public List<Saves> getSavesList() { return savesList; }
    public void setSavesList(List<Saves> savesList) { this.savesList = savesList; }

    public List<Board> getBoards() { return boards; }
    public void setBoards(List<Board> boards) { this.boards = boards; }

    public List<PostTag> getPostTags() { return postTags; }
    public void setPostTags(List<PostTag> postTags) { this.postTags = postTags; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }

    public Integer getSaves() { return saves; }
    public void setSaves(Integer saves) { this.saves = saves; }
}

