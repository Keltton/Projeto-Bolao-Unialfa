package com.grupo7.bolao.repository;

import com.grupo7.bolao.model.Selecao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SelecaoRepository extends JpaRepository<Selecao, Long> {
    Optional<Selecao> findByCodigoFifa(String codigoFifa);
    boolean existsByCodigoFifa(String codigoFifa);
    List<Selecao> findByGrupo(String grupo);
}
