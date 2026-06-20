package com.grupo7.bolao.repository;

import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.enums.PerfilUsuario;
import com.grupo7.bolao.enums.StatusUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    Page<Usuario> findByPerfilAndStatusOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc(
            PerfilUsuario perfil,
            StatusUsuario status,
            Pageable pageable
    );

    Page<Usuario> findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String nome,
            String email,
            StatusUsuario status,
            Pageable pageable
    );

    @Query("SELECT COUNT(u) + 1 FROM Usuario u WHERE u.perfil = com.grupo7.bolao.enums.PerfilUsuario.USUARIO AND u.status = :status AND (" +
           "u.pontuacaoTotal > :pontuacaoTotal OR " +
           "(u.pontuacaoTotal = :pontuacaoTotal AND u.placaresExatos > :placaresExatos) OR " +
           "(u.pontuacaoTotal = :pontuacaoTotal AND u.placaresExatos = :placaresExatos AND u.criadoEm < :criadoEm)" +
           ")")
    long obterPosicaoNoRanking(
            @Param("pontuacaoTotal") Integer pontuacaoTotal,
            @Param("placaresExatos") Integer placaresExatos,
            @Param("criadoEm") LocalDateTime criadoEm
    );
}