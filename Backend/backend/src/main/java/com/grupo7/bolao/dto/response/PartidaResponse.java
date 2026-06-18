package com.grupo7.bolao.dto.response;

import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;

import java.time.LocalDateTime;

public record PartidaResponse(
        Long id,
        SelecaoResponse selecaoA,
        SelecaoResponse selecaoB,
        LocalDateTime dataHora,
        String estadio,
        FasePartida fase,
        String grupo,
        StatusPartida status,
        Integer golsSelecaoA,
        Integer golsSelecaoB,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
