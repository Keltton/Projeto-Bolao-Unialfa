package com.grupo7.bolao.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ResultadoPartidaRequest(
        @NotNull
        @Min(0)
        Integer golsSelecaoA,

        @NotNull
        @Min(0)
        Integer golsSelecaoB
) {
}
