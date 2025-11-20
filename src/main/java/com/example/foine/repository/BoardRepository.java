package com.example.foine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.foine.entity.Board;
import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByUserId(Long userId);
    List<Board> findByIsPublicTrue();
}