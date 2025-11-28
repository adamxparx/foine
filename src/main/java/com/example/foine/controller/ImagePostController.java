package com.example.foine.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.foine.dto.ImagePostDTO;
import com.example.foine.entity.Comments;
import com.example.foine.entity.ImagePost;
import com.example.foine.entity.Likes;
import com.example.foine.entity.Saves;
import com.example.foine.entity.Tag;
import com.example.foine.entity.User;
import com.example.foine.exception.ImagePostException;
import com.example.foine.repository.CommentsRepository;
import com.example.foine.repository.LikesRepository;
import com.example.foine.repository.SavesRepository;
import com.example.foine.repository.UserRepository;
import com.example.foine.service.ImagePostService;
import com.example.foine.service.TagService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "#{'${cors.allowed-origins:http://localhost:4029}'.split(',')}")
public class ImagePostController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ImagePostController.class);

    @Value("${cors.allowed-origins:http://localhost:4029}")
    private String allowedOrigins;
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

    /**
     * Get all posts (global feed) with pagination
     * GET /api/posts?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Page<ImagePostDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        log.debug("GET /api/posts - page: {}, size: {}", page, size);

        try {
            Page<ImagePost> posts = imagePostService.getAllPosts(page, size);
            Page<ImagePostDTO> dtoPage = posts.map(ImagePostDTO::new);
            return ResponseEntity.ok(dtoPage);
        } catch (Exception e) {
            log.error("Error fetching posts: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get single post by ID
     * GET /api/posts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ImagePostDTO> getPostById(@PathVariable Long id) {
        log.debug("GET /api/posts/{}", id);

        try {
            ImagePost post = imagePostService.getPostById(id);
            return ResponseEntity.ok(new ImagePostDTO(post));
        } catch (ImagePostException e) {
            log.warn("Post not found: {}", id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error fetching post {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create new post
     * POST /api/posts/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<?> createImagePost(
            @RequestParam("title") @NotBlank String title,
            @RequestParam("description") String description,
            @RequestParam("userId") @NotNull Long userId,
            @RequestParam("image") @Valid MultipartFile image,
            @RequestParam(value = "tags", required = false) List<String> tags) {

        log.info("POST /api/posts/upload - userId: {}, title: {}", userId, title);

        try {
            ImagePost post = imagePostService.createImagePost(title, description, userId, image, tags);
            log.info("Post created successfully with ID: {}", post.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(new ImagePostDTO(post));
        } catch (ImagePostException e) {
            log.warn("Validation error creating post: {}", e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating post: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR", "Failed to create post"));
        }
    }

    /**
     * Update post
     * PUT /api/posts/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestParam("userId") @NotNull Long userId,
            @RequestParam("title") String title,
            @RequestParam("description") String description) {

        log.info("PUT /api/posts/{} - userId: {}", id, userId);

        try {
            ImagePost updatedPost = imagePostService.updatePost(id, userId, title, description);
            return ResponseEntity.ok(new ImagePostDTO(updatedPost));
        } catch (ImagePostException e) {
            log.warn("Error updating post {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating post {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR", "Failed to update post"));
        }
    }

    /**
     * Delete post
     * DELETE /api/posts/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            @RequestParam("userId") @NotNull Long userId) {

        log.info("DELETE /api/posts/{} - userId: {}", id, userId);

        try {
            imagePostService.deletePost(id, userId);
            return ResponseEntity.noContent().build();
        } catch (ImagePostException e) {
            log.warn("Error deleting post {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            log.error("Error deleting post {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR", "Failed to delete post"));
        }
    }

    /**
     * Get posts by user ID
     * GET /api/posts/user/{userId}?page=0&size=10
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ImagePostDTO>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        log.debug("GET /api/posts/user/{} - page: {}, size: {}", userId, page, size);

        try {
            Page<ImagePost> posts = imagePostService.getUserPosts(userId, page, size);
            Page<ImagePostDTO> dtoPage = posts.map(ImagePostDTO::new);
            return ResponseEntity.ok(dtoPage);
        } catch (ImagePostException e) {
            log.warn("Error fetching user posts: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error fetching user posts: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search posts
     * GET /api/posts/search?query=searchterm&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ImagePostDTO>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        log.debug("GET /api/posts/search - query: '{}', page: {}, size: {}", query, page, size);

        try {
            Page<ImagePost> posts = imagePostService.searchPosts(query, page, size);
            Page<ImagePostDTO> dtoPage = posts.map(ImagePostDTO::new);
            return ResponseEntity.ok(dtoPage);
        } catch (Exception e) {
            log.error("Error searching posts: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Like/unlike post
     * POST /api/posts/{id}/like
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        log.debug("POST /api/posts/{}/like", id);

        try {
            ImagePost post = imagePostService.toggleLike(id);
            return ResponseEntity.ok(new ImagePostDTO(post));
        } catch (ImagePostException e) {
            log.warn("Error toggling like on post {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(createErrorResponse("VALIDATION_ERROR", e.getMessage()));
        } catch (Exception e) {
            log.error("Error toggling like on post {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("INTERNAL_ERROR", "Failed to toggle like"));
        }
    }

    /**
     * Global exception handler for ImagePostException
     */
    @ExceptionHandler(ImagePostException.class)
    public ResponseEntity<Map<String, String>> handleImagePostException(ImagePostException e) {
        log.warn("ImagePostException: {}", e.getMessage());
        return ResponseEntity.badRequest()
                .body(createErrorResponse("VALIDATION_ERROR", e.getMessage()));
    }

    /**
     * Global exception handler for general exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception e) {
        log.error("Unexpected error: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
    }

    /**
     * Helper method to create error response
     */
    private Map<String, String> createErrorResponse(String errorType, String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", errorType);
        error.put("message", message);
        return error;
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
    public ResponseEntity<List<ImagePostDTO>> getPostsByTag(@PathVariable String tagName) {
        List<ImagePost> posts = tagService.getPostsByTag(tagName);
        List<ImagePostDTO> dtoList = posts.stream().map(ImagePostDTO::new).toList();
        return ResponseEntity.ok(dtoList);
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
            ImagePost post = imagePostService.getPostById(postId);
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
            ImagePost post = imagePostService.getPostById(postId);
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

    @GetMapping("/test")
    public ResponseEntity<String> testGet() {
        return ResponseEntity.ok("GET works");
    }
}
