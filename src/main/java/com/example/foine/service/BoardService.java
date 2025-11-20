package com.example.foine.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.foine.entity.Board;
import com.example.foine.entity.ImagePost;
import com.example.foine.entity.User;
import com.example.foine.repository.BoardRepository;
import com.example.foine.repository.ImagePostRepository;
import com.example.foine.repository.UserRepository;
import java.util.List;
import java.util.Optional;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImagePostRepository imagePostRepository;

    public List<Board> getAllPublicBoards() {
        return boardRepository.findByIsPublicTrue();
    }

    public List<Board> getBoardsByUserId(Long userId) {
        return boardRepository.findByUserId(userId);
    }

    public Optional<Board> getBoardById(Long id) {
        return boardRepository.findById(id);
    }

    public Board createBoard(String name, String description, boolean isPublic, Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            Board board = new Board(name, description, isPublic, user.get());
            return boardRepository.save(board);
        }
        return null;
    }

    public boolean addPostToBoard(Long boardId, Long postId, Long userId) {
        Optional<Board> board = boardRepository.findById(boardId);
        Optional<ImagePost> post = imagePostRepository.findById(postId);
        if (board.isPresent() && post.isPresent() && board.get().getUser().getId().equals(userId)) {
            board.get().getPosts().add(post.get());
            boardRepository.save(board.get());
            return true;
        }
        return false;
    }

    public boolean removePostFromBoard(Long boardId, Long postId, Long userId) {
        Optional<Board> board = boardRepository.findById(boardId);
        Optional<ImagePost> post = imagePostRepository.findById(postId);
        if (board.isPresent() && post.isPresent() && board.get().getUser().getId().equals(userId)) {
            board.get().getPosts().remove(post.get());
            boardRepository.save(board.get());
            return true;
        }
        return false;
    }

    public boolean deleteBoard(Long id, Long userId) {
        Optional<Board> board = boardRepository.findById(id);
        if (board.isPresent() && board.get().getUser().getId().equals(userId)) {
            boardRepository.delete(board.get());
            return true;
        }
        return false;
    }
}