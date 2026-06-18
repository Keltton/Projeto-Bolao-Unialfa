package com.grupo7.bolao.dto.response;

import com.grupo7.bolao.enums.PerfilUsuario;
import com.grupo7.bolao.enums.StatusUsuario;

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
}
