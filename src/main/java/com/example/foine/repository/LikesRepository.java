package com.example.foine.repository;

import com.example.foine.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikesRepository extends JpaRepository<Likes, Long> {
    boolean existsByImagePostIdAndUserId(Long postId, Long userId);
    Likes findByImagePostIdAndUserId(Long postId, Long userId);
    void deleteByImagePostIdAndUserId(Long postId, Long userId);
    long countByImagePostId(Long postId);
}