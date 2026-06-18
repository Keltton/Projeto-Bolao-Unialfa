package com.grupo7.bolao.dto.response;

import com.grupo7.bolao.enums.CriterioPontuacao;

import java.time.LocalDateTime;

public record PalpiteResponse(
        Long id,
        UsuarioResponse usuario,
        PartidaResponse partida,
        Integer golsSelecaoA,
        Integer golsSelecaoB,
        Integer pontos,
        CriterioPontuacao criterioPontuacao,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
