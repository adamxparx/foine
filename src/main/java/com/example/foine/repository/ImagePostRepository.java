package com.example.foine.repository;

import com.example.foine.entity.ImagePost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImagePostRepository extends JpaRepository<ImagePost, Long> {
    Page<ImagePost> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description, Pageable pageable);
}
