package com.grupo7.bolao.repository;

import com.grupo7.bolao.enums.CriterioPontuacao;
import com.grupo7.bolao.model.Palpite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PalpiteRepository extends JpaRepository<Palpite, Long> {
    List<Palpite> findByUsuarioId(Long usuarioId);
    List<Palpite> findByPartidaId(Long partidaId);
    List<Palpite> findAllByOrderByCriadoEmDesc();
    List<Palpite> findByPartidaIdOrderByCriadoEmDesc(Long partidaId);
    List<Palpite> findByCriterioPontuacaoOrderByCriadoEmDesc(CriterioPontuacao criterioPontuacao);
    List<Palpite> findByPartidaIdAndCriterioPontuacaoOrderByCriadoEmDesc(Long partidaId, CriterioPontuacao criterioPontuacao);
    Optional<Palpite> findByIdAndUsuarioId(Long id, Long usuarioId);
    boolean existsByUsuarioIdAndPartidaId(Long usuarioId, Long partidaId);
    boolean existsByPartidaId(Long partidaId);

    @Query("""
            SELECT p FROM Palpite p
            JOIN p.usuario u
            WHERE LOWER(u.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
               OR LOWER(u.email) LIKE LOWER(CONCAT('%', :busca, '%'))
            ORDER BY p.criadoEm DESC
            """)
    List<Palpite> findByUsuarioBuscaOrderByCriadoEmDesc(@Param("busca") String busca);
}
