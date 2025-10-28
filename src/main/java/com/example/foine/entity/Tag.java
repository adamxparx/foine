package com.example.foine.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tag")
public class Tag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag_name", nullable = false, unique = true)
    private String tagName;

    // Many-to-Many relationship with ImagePost
    @ManyToMany(mappedBy = "tags")
    private Set<ImagePost> posts = new HashSet<>();

    public Tag() {}

    public Tag(String tagName) {
        this.tagName = tagName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTagName() { return tagName; }
    public void setTagName(String tagName) { this.tagName = tagName; }

    public Set<ImagePost> getPosts() { return posts; }
    public void setPosts(Set<ImagePost> posts) { this.posts = posts; }
}