package com.example.foine.controller;

import com.example.foine.entity.ImagePost;
import java.util.List;
import com.example.foine.service.ImagePostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.foine.entity.Likes;
import com.example.foine.entity.Saves;
import com.example.foine.entity.Comments;
import com.example.foine.repository.LikesRepository;
import com.example.foine.repository.SavesRepository;
import com.example.foine.repository.CommentsRepository;
import com.example.foine.repository.UserRepository;

@RestController
@RequestMapping("/api/posts")
public class ImagePostController {
    @Autowired
    private ImagePostService imagePostService;

    @Autowired
    private LikesRepository likesRepository;

    @Autowired
    private SavesRepository savesRepository;

    @Autowired
    private CommentsRepository commentsRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<ImagePost> createImagePost(
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("userId") Long userId,
        @RequestParam("image") MultipartFile image
    ) {
        try {
            ImagePost post = imagePostService.createImagePost(title, description, userId, image);
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

    @PostMapping("/{postId}/comment")
    public ResponseEntity<Comments> addComment(@PathVariable Long postId, @RequestParam Long userId, @RequestParam String comment) {
        ImagePost post = imagePostService.getImagePostById(postId);
        Comments newComment = new Comments();
        newComment.setComment(comment);
        newComment.setImagePost(post);
        newComment.setUser(userRepository.findById(userId).orElseThrow());
        commentsRepository.save(newComment);
        return ResponseEntity.ok(newComment);
    }

    @GetMapping("/{postId}/likes/count")
    public ResponseEntity<Long> getLikesCount(@PathVariable Long postId) {
        long count = likesRepository.countByImagePostId(postId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{postId}/liked")
    public ResponseEntity<Boolean> isLiked(@PathVariable Long postId, @RequestParam Long userId) {
        boolean liked = likesRepository.existsByImagePostIdAndUserId(postId, userId);
        return ResponseEntity.ok(liked);
    }

    @GetMapping("/{postId}/saved")
    public ResponseEntity<Boolean> isSaved(@PathVariable Long postId, @RequestParam Long userId) {
        boolean saved = savesRepository.existsByImagePostIdAndUserId(postId, userId);
        return ResponseEntity.ok(saved);
    }
}
