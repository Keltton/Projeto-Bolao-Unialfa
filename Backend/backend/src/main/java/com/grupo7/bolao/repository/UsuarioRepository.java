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

//interface responsavel pelas operações no banco de dados, neste caso temos procuras:
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    //por email
    Optional<Usuario> findByEmail(String email);

    //verifica se ja existe um usuario cadastrado com este email
    boolean existsByEmail(String email);

    //uma pesquisa por perfil e status em ordem de pontuação
    Page<Usuario> findByPerfilAndStatusOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc(
            PerfilUsuario perfil,
            StatusUsuario status,
            Pageable pageable
    );

    //procure pelo nome ou email, não é case sensitive
    Page<Usuario> findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String nome,
            String email,
            Pageable pageable
    );


    //busca apenas usuarios comuns aplicando filtro opcional por nome ou email
    @Query("SELECT u FROM Usuario u WHERE u.perfil = com.grupo7.bolao.enums.PerfilUsuario.USUARIO " +
            "AND (:busca IS NULL OR :busca = '' OR " +
            "LOWER(u.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :busca, '%')))")
    Page<Usuario> buscarUsuariosComuns(@Param("busca") String busca, Pageable pageable);


    //calcula a posição do usuario no ranking comparando pontuação e critérios de desempate
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