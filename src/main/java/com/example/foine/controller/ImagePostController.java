package com.example.foine.controller;

import com.example.foine.entity.ImagePost;
import java.util.List;
import java.util.Map;
import com.example.foine.service.ImagePostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.foine.entity.Likes;
import com.example.foine.entity.Saves;
import com.example.foine.entity.Comments;
import com.example.foine.entity.User;
import com.example.foine.entity.Tag;
import com.example.foine.repository.LikesRepository;
import com.example.foine.repository.SavesRepository;
import com.example.foine.repository.CommentsRepository;
import com.example.foine.repository.UserRepository;
import com.example.foine.service.TagService;

@RestController
@RequestMapping("/api")
public class ImagePostController {

    public ImagePostController() {
    }
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

    @Autowired
    private TagService tagService;

    @PostMapping("/posts/upload")
    public ResponseEntity<?> createImagePost(
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("userId") Long userId,
        @RequestParam("image") MultipartFile image,
        @RequestParam(value = "tags", required = false) List<String> tags
    ) {
        try {
            ImagePost post = imagePostService.createImagePost(title, description, userId, image, tags);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deleteImagePost(@PathVariable Long id) {
        imagePostService.deleteImagePost(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/posts")
    public ResponseEntity<org.springframework.data.domain.Page<ImagePost>> getAllImagePosts(
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "12") int size) {
        org.springframework.data.domain.Page<ImagePost> posts = imagePostService.getAllImagePosts(
            org.springframework.data.domain.PageRequest.of(page, size,
            org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id")));
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/posts/search")
    public ResponseEntity<org.springframework.data.domain.Page<ImagePost>> searchPosts(
            @RequestParam String query,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "12") int size) {
        org.springframework.data.domain.Page<ImagePost> posts = imagePostService.searchPosts(query,
            org.springframework.data.domain.PageRequest.of(page, size,
            org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id")));
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/posts/{postId}/comment")
    public ResponseEntity<Comments> addComment(@PathVariable Long postId, @RequestParam Long userId, @RequestParam String comment) {
        ImagePost post = imagePostService.getImagePostById(postId);
        Comments newComment = new Comments();
        newComment.setComment(comment);
        newComment.setImagePost(post);
        newComment.setUser(userRepository.findById(userId).orElseThrow());
        commentsRepository.save(newComment);
        return ResponseEntity.ok(newComment);
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<Comments>> getComments(@PathVariable Long postId) {
        List<Comments> comments = commentsRepository.findByImagePostId(postId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/posts/{postId}/tags")
    public ResponseEntity<List<Tag>> getPostTags(@PathVariable Long postId) {
        List<Tag> tags = tagService.getTagsForPost(postId);
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/posts/tag/{tagName}")
    public ResponseEntity<List<ImagePost>> getPostsByTag(@PathVariable String tagName) {
        List<ImagePost> posts = tagService.getPostsByTag(tagName);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/posts/{postId}/likes/count")
    public ResponseEntity<Long> getLikesCount(@PathVariable Long postId) {
        long count = likesRepository.countByImagePostId(postId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/posts/{postId}/liked")
    public ResponseEntity<Boolean> isLiked(@PathVariable Long postId, @RequestParam Long userId) {
        boolean liked = likesRepository.existsByImagePostIdAndUserId(postId, userId);
        return ResponseEntity.ok(liked);
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<Void> toggleLike(@PathVariable Long postId, @RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        try {
            ImagePost post = imagePostService.getImagePostById(postId);
            User user = userRepository.findById(userId).orElseThrow();
            
            // Check if already liked
            boolean alreadyLiked = likesRepository.existsByImagePostIdAndUserId(postId, userId);
            if (alreadyLiked) {
                // Unlike
                Likes like = likesRepository.findByImagePostIdAndUserId(postId, userId);
                if (like != null) {
                    likesRepository.delete(like);
                }
            } else {
                // Like
                Likes like = new Likes();
                like.setImagePost(post);
                like.setUser(user);
                likesRepository.save(like);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/posts/{postId}/save")
    public ResponseEntity<Void> toggleSave(@PathVariable Long postId, @RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        try {
            ImagePost post = imagePostService.getImagePostById(postId);
            User user = userRepository.findById(userId).orElseThrow();
            
            // Check if already saved
            boolean alreadySaved = savesRepository.existsByImagePostIdAndUserId(postId, userId);
            if (alreadySaved) {
                // Unsave
                savesRepository.deleteByImagePostIdAndUserId(postId, userId);
            } else {
                // Save
                Saves save = new Saves();
                save.setImagePost(post);
                save.setUser(user);
                savesRepository.save(save);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/posts/test")
    public ResponseEntity<String> testPost() {
        return ResponseEntity.ok("POST works");
    }
}
