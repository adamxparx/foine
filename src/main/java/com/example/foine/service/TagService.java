package com.example.foine.service;

import com.example.foine.entity.Tag;
import com.example.foine.entity.PostTag;
import com.example.foine.entity.ImagePost;
import com.example.foine.repository.TagRepository;
import com.example.foine.repository.PostTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private PostTagRepository postTagRepository;

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public Optional<Tag> getTagById(Long id) {
        return tagRepository.findById(id);
    }

    public Optional<Tag> getTagByName(String tagName) {
        return tagRepository.findByTagName(tagName);
    }

    public List<Tag> searchTags(String query) {
        return tagRepository.findByTagNameContainingIgnoreCase(query);
    }

    public List<Tag> getPopularTags() {
        return tagRepository.findPopularTags();
    }

    @Transactional
    public Tag createTag(String tagName) {
        Optional<Tag> existingTag = tagRepository.findByTagName(tagName);
        if (existingTag.isPresent()) {
            return existingTag.get();
        }

        Tag tag = new Tag(tagName);
        return tagRepository.save(tag);
    }

    @Transactional
    public void addTagsToPost(ImagePost post, List<String> tagNames) {
        // Remove existing tags
        postTagRepository.deleteByPost(post);

        // Add new tags
        for (String tagName : tagNames) {
            if (tagName != null && !tagName.trim().isEmpty()) {
                Tag tag = createTag(tagName.trim());
                PostTag postTag = new PostTag(post, tag);
                postTagRepository.save(postTag);
            }
        }
    }

    public List<Tag> getTagsForPost(Long postId) {
        List<PostTag> postTags = postTagRepository.findByPostId(postId);
        return postTags.stream()
                .map(PostTag::getTag)
                .collect(Collectors.toList());
    }

    public List<ImagePost> getPostsByTag(String tagName) {
        Optional<Tag> tag = tagRepository.findByTagName(tagName);
        if (tag.isPresent()) {
            List<PostTag> postTags = postTagRepository.findByTag(tag.get());
            return postTags.stream()
                    .map(PostTag::getPost)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    @Transactional
    public void removeTagFromPost(ImagePost post, String tagName) {
        Optional<Tag> tag = tagRepository.findByTagName(tagName);
        if (tag.isPresent()) {
            List<PostTag> postTags = postTagRepository.findByPost(post);
            postTags.stream()
                    .filter(pt -> pt.getTag().equals(tag.get()))
                    .forEach(postTagRepository::delete);
        }
    }

    @Transactional
    public void deleteTag(Long tagId) {
        Optional<Tag> tag = tagRepository.findById(tagId);
        if (tag.isPresent()) {
            postTagRepository.deleteByTag(tag.get());
            tagRepository.delete(tag.get());
        }
    }
}