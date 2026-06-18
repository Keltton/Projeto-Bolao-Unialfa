package com.grupo7.bolao.dto.request;

import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record PartidaRequest(
        @NotNull
        Long selecaoAId,

        @NotNull
        Long selecaoBId,

        @NotNull
        @FutureOrPresent
        LocalDateTime dataHora,

        @Size(max = 150)
        String estadio,

        @NotNull
        FasePartida fase,

        @Size(max = 10)
        String grupo,

        StatusPartida status
) {
}
