package com.grupo7.bolao.dto.response;

import com.grupo7.bolao.enums.PerfilUsuario;
import com.grupo7.bolao.enums.StatusUsuario;
import com.grupo7.bolao.model.Usuario;

import java.time.LocalDateTime;

public record UsuarioResponse(Long id,
                              String nome,
                              String email,
                              String avatarUrl,
                              PerfilUsuario perfil,
                              StatusUsuario status,
                              Integer pontuacaoTotal,
                              Integer placaresExatos,
                              LocalDateTime ultimoLoginEm,
                              LocalDateTime criadoEm,
                              LocalDateTime atualizadoEm) {

    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getAvatarUrl(),
                usuario.getPerfil(),
                usuario.getStatus(),
                usuario.getPontuacaoTotal(),
                usuario.getPlacaresExatos(),
                usuario.getUltimoLoginEm(),
                usuario.getCriadoEm(),
                usuario.getAtualizadoEm()
        );
    }
}