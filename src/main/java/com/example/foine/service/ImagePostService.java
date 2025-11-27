package com.example.foine.service;

import com.example.foine.entity.ImagePost;
import com.example.foine.entity.User;
import com.example.foine.repository.ImagePostRepository;
import com.example.foine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ImagePostService {
    @Autowired
    private ImagePostRepository imagePostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private TagService tagService;

    public ImagePost createImagePost(String title, String description, Long userId, MultipartFile file) throws Exception {
        return createImagePost(title, description, userId, file, null);
    }

    public ImagePost createImagePost(String title, String description, Long userId, MultipartFile file, List<String> tags) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));
        String imageUrl = cloudinaryService.uploadFile(file);
        ImagePost imagePost = new ImagePost(title, description, imageUrl, user);
        imagePost = imagePostRepository.save(imagePost);

        // Add tags if provided
        if (tags != null && !tags.isEmpty()) {
            tagService.addTagsToPost(imagePost, tags);
        }

        return imagePost;
    }

    public org.springframework.data.domain.Page<ImagePost> getAllImagePosts(org.springframework.data.domain.Pageable pageable) {
        return imagePostRepository.findAll(pageable);
    }

    public org.springframework.data.domain.Page<ImagePost> searchPosts(String query, org.springframework.data.domain.Pageable pageable) {
        return imagePostRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, pageable);
    }

    public ImagePost getImagePostById(Long id) {
        return imagePostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ImagePost not found"));
    }

    public void deleteImagePost(Long id) {
        imagePostRepository.deleteById(id);
    }
}
