package com.example.foine.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.foine.entity.ImagePost;

@Repository
public interface ImagePostRepository extends JpaRepository<ImagePost, Long> {

    // Find all posts by user ID, ordered by newest first
    Page<ImagePost> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    // Find all posts ordered by newest first (for global feed)
    Page<ImagePost> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Search posts by title or description (case insensitive)
    @Query("SELECT p FROM ImagePost p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY p.createdAt DESC")
    Page<ImagePost> searchByTitleOrDescription(@Param("query") String query, Pageable pageable);

    // Find posts by user ID (without pagination, for user profile)
    List<ImagePost> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Count posts by user ID
    long countByUserId(Long userId);

    // Check if post exists by ID and user ID (for ownership validation)
    boolean existsByIdAndUserId(Long id, Long userId);
}
