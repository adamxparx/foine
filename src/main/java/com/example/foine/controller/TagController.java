package com.example.foine.controller;

import com.example.foine.entity.Tag;
import com.example.foine.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "*")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        return tagService.getTagById(id)
                .map(tag -> ResponseEntity.ok(tag))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Tag>> searchTags(@RequestParam String query) {
        List<Tag> tags = tagService.searchTags(query);
        return ResponseEntity.ok(tags);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Tag>> getPopularTags() {
        List<Tag> tags = tagService.getPopularTags();
        return ResponseEntity.ok(tags);
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestParam String tagName) {
        try {
            Tag tag = tagService.createTag(tagName);
            return ResponseEntity.ok(tag);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.ok().build();
    }
}