package com.example.foine.service;

import com.example.foine.entity.ImagePost;
import com.example.foine.entity.User;
import com.example.foine.repository.ImagePostRepository;
import com.example.foine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImagePostService {
    @Autowired
    private ImagePostRepository imagePostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public ImagePost createImagePost(String caption, Long userId, MultipartFile file) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));
        String imageUrl = cloudinaryService.uploadFile(file);
        ImagePost imagePost = new ImagePost(caption, imageUrl, user);
        return imagePostRepository.save(imagePost);
    }

    public java.util.List<ImagePost> getAllImagePosts() {
        return imagePostRepository.findAll();
    }

    public ImagePost getImagePostById(Long id) {
        return imagePostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ImagePost not found"));
    }

    public void deleteImagePost(Long id) {
        imagePostRepository.deleteById(id);
    }
}
