package com.example.foine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.foine.entity.Board;
import com.example.foine.service.BoardService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @GetMapping("/public")
    public ResponseEntity<List<Board>> getPublicBoards() {
        return ResponseEntity.ok(boardService.getAllPublicBoards());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Board>> getBoardsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(boardService.getBoardsByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
        Optional<Board> board = boardService.getBoardById(id);
        return board.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBoard(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam(defaultValue = "true") boolean isPublic,
            @RequestParam Long userId) {
        Board board = boardService.createBoard(name, description, isPublic, userId);
        if (board != null) {
            return ResponseEntity.ok(board);
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }
    }

    @PostMapping("/{boardId}/add/{postId}")
    public ResponseEntity<?> addPostToBoard(@PathVariable Long boardId, @PathVariable Long postId, @RequestParam Long userId) {
        boolean success = boardService.addPostToBoard(boardId, postId, userId);
        if (success) {
            return ResponseEntity.ok("Post added to board");
        } else {
            return ResponseEntity.status(403).body("Unauthorized or not found");
        }
    }

    @DeleteMapping("/{boardId}/remove/{postId}")
    public ResponseEntity<?> removePostFromBoard(@PathVariable Long boardId, @PathVariable Long postId, @RequestParam Long userId) {
        boolean success = boardService.removePostFromBoard(boardId, postId, userId);
        if (success) {
            return ResponseEntity.ok("Post removed from board");
        } else {
            return ResponseEntity.status(403).body("Unauthorized or not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id, @RequestParam Long userId) {
        boolean deleted = boardService.deleteBoard(id, userId);
        if (deleted) {
            return ResponseEntity.ok("Board deleted");
        } else {
            return ResponseEntity.status(403).body("Unauthorized or board not found");
        }
    }
}