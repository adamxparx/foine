package com.example.foine.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "post_tag")
public class PostTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private ImagePost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    public PostTag() {}

    public PostTag(ImagePost post, Tag tag) {
        this.post = post;
        this.tag = tag;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ImagePost getPost() { return post; }
    public void setPost(ImagePost post) { this.post = post; }

    public Tag getTag() { return tag; }
    public void setTag(Tag tag) { this.tag = tag; }
}