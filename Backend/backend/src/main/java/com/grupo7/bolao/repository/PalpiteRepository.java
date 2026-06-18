package com.grupo7.bolao.repository;

import com.grupo7.bolao.model.Palpite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PalpiteRepository extends JpaRepository<Palpite, Long> {
    List<Palpite> findByUsuarioId(Long usuarioId);
    List<Palpite> findByPartidaId(Long partidaId);
    Optional<Palpite> findByIdAndUsuarioId(Long id, Long usuarioId);
    boolean existsByUsuarioIdAndPartidaId(Long usuarioId, Long partidaId);
}
