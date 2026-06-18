package com.grupo7.bolao.dto.response;

import java.time.LocalDateTime;

public record SelecaoResponse(
        Long id,
        String nome,
        String codigoFifa,
        String bandeiraUrl,
        String grupo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
