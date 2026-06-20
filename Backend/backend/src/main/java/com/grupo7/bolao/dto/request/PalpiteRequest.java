package com.grupo7.bolao.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PalpiteRequest(
        @NotNull
        Long partidaId,

        @NotNull
        @Min(0)
        Integer golsSelecaoA,

        @NotNull
        @Min(0)
        Integer golsSelecaoB
) {
}
