package com.example.foine.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "tag")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag_name", nullable = false, length = 255)
    private String tagName;

    @OneToMany(mappedBy = "tag", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostTag> postTags;

    public Tag() {}

    public Tag(String tagName) {
        this.tagName = tagName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTagName() { return tagName; }
    public void setTagName(String tagName) { this.tagName = tagName; }

    public List<PostTag> getPostTags() { return postTags; }
    public void setPostTags(List<PostTag> postTags) { this.postTags = postTags; }
}