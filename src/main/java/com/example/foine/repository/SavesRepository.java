package com.example.foine.repository;

import com.example.foine.entity.Saves;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavesRepository extends JpaRepository<Saves, Long> {
    boolean existsByImagePostIdAndUserId(Long postId, Long userId);
    void deleteByImagePostIdAndUserId(Long postId, Long userId);
    long countByImagePostId(Long postId);
}