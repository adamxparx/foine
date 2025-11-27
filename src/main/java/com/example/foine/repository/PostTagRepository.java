package com.example.foine.repository;

import com.example.foine.entity.PostTag;
import com.example.foine.entity.ImagePost;
import com.example.foine.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, Long> {
    List<PostTag> findByPost(ImagePost post);

    List<PostTag> findByTag(Tag tag);

    @Query("SELECT pt FROM PostTag pt WHERE pt.post.id = :postId")
    List<PostTag> findByPostId(@Param("postId") Long postId);

    @Query("SELECT pt FROM PostTag pt WHERE pt.tag.id = :tagId")
    List<PostTag> findByTagId(@Param("tagId") Long tagId);

    void deleteByPost(ImagePost post);

    void deleteByTag(Tag tag);
}