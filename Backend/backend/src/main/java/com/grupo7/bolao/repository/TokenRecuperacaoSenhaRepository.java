package com.grupo7.bolao.repository;

import com.grupo7.bolao.model.TokenRecuperacaoSenha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

//interface responsavel pelas operações no banco de dados, neste caso só procura pelo token
public interface TokenRecuperacaoSenhaRepository extends JpaRepository<TokenRecuperacaoSenha, Long> {

    // procura um codigo de recuperacao pelo hash armazenado no banco
    Optional<TokenRecuperacaoSenha> findByTokenHash(String tokenHash);

    // remove todos os codigos de recuperacao vinculados ao usuario
    @Transactional
    void deleteByUsuarioId(Long usuarioId);
}