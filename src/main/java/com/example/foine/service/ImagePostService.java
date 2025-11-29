package com.example.foine.service;

import com.example.foine.entity.ImagePost;
import com.example.foine.entity.User;
import com.example.foine.exception.ImagePostException;
import com.example.foine.repository.ImagePostRepository;
import com.example.foine.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ImagePostService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ImagePostService.class);

    @Autowired
    private ImagePostRepository imagePostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private TagService tagService;

    /**
     * Create a new image post
     */
    public ImagePost createImagePost(String title, String description, Long userId, MultipartFile file) throws Exception {
        return createImagePost(title, description, userId, file, null);
    }

    /**
     * Create a new image post with tags
     */
    public ImagePost createImagePost(String title, String description, Long userId, MultipartFile file, List<String> tags) throws Exception {
        log.info("Creating image post for user ID: {}", userId);

        // Validate inputs
        if (title == null || title.trim().isEmpty()) {
            throw new ImagePostException("Title is required");
        }
        if (userId == null) {
            throw new ImagePostException("User ID is required");
        }
        if (file == null || file.isEmpty()) {
            throw new ImagePostException("Image file is required");
        }

        // Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ImagePostException("User not found with ID: " + userId));

        try {
            // Upload image to Cloudinary
            String imageUrl = cloudinaryService.uploadFile(file);
            log.debug("Image uploaded to Cloudinary: {}", imageUrl);

            // Create and save post
            ImagePost imagePost = new ImagePost(title.trim(), description != null ? description.trim() : "", imageUrl, user);
            imagePost = imagePostRepository.save(imagePost);
            log.info("Image post created with ID: {}", imagePost.getId());

            // Add tags if provided
            if (tags != null && !tags.isEmpty()) {
                tagService.addTagsToPost(imagePost, tags);
                log.debug("Added {} tags to post {}", tags.size(), imagePost.getId());
            }

            return imagePost;
        } catch (Exception e) {
            log.error("Failed to create image post for user {}: {}", userId, e.getMessage(), e);
            throw new ImagePostException("Failed to create image post: " + e.getMessage(), e);
        }
    }

    /**
     * Get all posts with pagination (global feed)
     */
    @Transactional(readOnly = true)
    public Page<ImagePost> getAllPosts(int page, int size) {
        log.debug("Fetching all posts - page: {}, size: {}", page, size);
        Pageable pageable = org.springframework.data.domain.PageRequest.of(
            page, size, org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        return imagePostRepository.findAll(pageable);
    }

    /**
     * Get posts by user ID
     */
    @Transactional(readOnly = true)
    public List<ImagePost> getUserPosts(Long userId) {
        log.debug("Fetching posts for user ID: {}", userId);
        if (userId == null) {
            throw new ImagePostException("User ID is required");
        }
        return imagePostRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get paginated posts by user ID
     */
    @Transactional(readOnly = true)
    public Page<ImagePost> getUserPosts(Long userId, int page, int size) {
        log.debug("Fetching paginated posts for user ID: {} - page: {}, size: {}", userId, page, size);
        if (userId == null) {
            throw new ImagePostException("User ID is required");
        }
        Pageable pageable = org.springframework.data.domain.PageRequest.of(
            page, size, org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        return imagePostRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    /**
     * Get single post by ID
     */
    @Transactional(readOnly = true)
    public ImagePost getPostById(Long id) {
        log.debug("Fetching post by ID: {}", id);
        return imagePostRepository.findById(id)
            .orElseThrow(() -> new ImagePostException("Post not found with ID: " + id));
    }

    /**
     * Delete post
     */
    public void deletePost(Long postId) {
        log.info("Deleting post ID: {}", postId);
        if (postId == null) {
            throw new ImagePostException("Post ID is required");
        }

        ImagePost post = getPostById(postId);
        imagePostRepository.delete(post);
        log.info("Post deleted successfully: {}", postId);
    }

    /**
     * Delete post with ownership validation
     */
    public void deletePost(Long postId, Long userId) {
        log.info("Deleting post ID: {} for user ID: {}", postId, userId);
        if (postId == null || userId == null) {
            throw new ImagePostException("Post ID and User ID are required");
        }

        if (!imagePostRepository.existsByIdAndUserId(postId, userId)) {
            throw new ImagePostException("Post not found or access denied");
        }

        deletePost(postId);
    }

    /**
     * Update post title and description
     */
    public ImagePost updatePost(Long postId, String title, String description) {
        log.info("Updating post ID: {}", postId);

        if (postId == null) {
            throw new ImagePostException("Post ID is required");
        }

        ImagePost post = getPostById(postId);

        if (title != null && !title.trim().isEmpty()) {
            post.setTitle(title.trim());
        }
        if (description != null) {
            post.setDescription(description.trim());
        }

        post.setUpdatedAt(LocalDateTime.now());
        ImagePost savedPost = imagePostRepository.save(post);
        log.info("Post updated successfully: {}", postId);

        return savedPost;
    }

    /**
     * Update post with ownership validation
     */
    public ImagePost updatePost(Long postId, Long userId, String title, String description) {
        log.info("Updating post ID: {} for user ID: {}", postId, userId);

        if (!imagePostRepository.existsByIdAndUserId(postId, userId)) {
            throw new ImagePostException("Post not found or access denied");
        }

        return updatePost(postId, title, description);
    }

    /**
     * Search posts by query
     */
    @Transactional(readOnly = true)
    public Page<ImagePost> searchPosts(String query, int page, int size) {
        log.debug("Searching posts with query: '{}' - page: {}, size: {}", query, page, size);

        if (query == null || query.trim().isEmpty()) {
            return getAllPosts(page, size);
        }

        Pageable pageable = org.springframework.data.domain.PageRequest.of(
            page, size, org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));

        return imagePostRepository.searchByTitleOrDescription(query.trim(), pageable);
    }

    /**
     * Toggle like on post
     */
    public ImagePost toggleLike(Long postId) {
        log.debug("Toggling like on post ID: {}", postId);

        ImagePost post = getPostById(postId);
        // Note: This is a simplified version. In a real app, you'd track individual user likes
        // For now, we'll just increment/decrement the counter
        post.setLikes(post.getLikes() + 1); // Simplified - should check if user already liked
        post.setUpdatedAt(LocalDateTime.now());

        return imagePostRepository.save(post);
    }

    /**
     * Get post count for user
     */
    @Transactional(readOnly = true)
    public long getUserPostCount(Long userId) {
        if (userId == null) {
            return 0;
        }
        return imagePostRepository.countByUserId(userId);
    }
}
