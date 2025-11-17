package com.example.foine.controller;

import com.example.foine.entity.ImagePost;
import java.util.List;
import com.example.foine.service.ImagePostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/image-posts")
public class ImagePostController {
    @Autowired
    private ImagePostService imagePostService;

    @PostMapping
    public ResponseEntity<ImagePost> createImagePost(
        @RequestParam("caption") String caption,
        @RequestParam("userId") Long userId,
        @RequestParam("file") MultipartFile file
    ) {
        try {
            ImagePost post = imagePostService.createImagePost(caption, userId, file);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImagePost(@PathVariable Long id) {
        imagePostService.deleteImagePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ImagePost>> getAllImagePosts() {
        List<ImagePost> posts = imagePostService.getAllImagePosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagePost> getImagePostById(@PathVariable Long id) {
        ImagePost post = imagePostService.getImagePostById(id);
        return ResponseEntity.ok(post);
    }
}
