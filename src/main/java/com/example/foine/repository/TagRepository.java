package com.example.foine.repository;

import com.example.foine.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByTagName(String tagName);

    @Query("SELECT t FROM Tag t WHERE LOWER(t.tagName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Tag> findByTagNameContainingIgnoreCase(@Param("query") String query);

    @Query("SELECT t FROM Tag t ORDER BY SIZE(t.postTags) DESC")
    List<Tag> findPopularTags();
}