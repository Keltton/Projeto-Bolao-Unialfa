package com.grupo7.bolao.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SelecaoRequest(
        @NotBlank
        @Size(max = 100)
        String nome,

        @NotBlank
        @Size(min = 3, max = 3)
        String codigoFifa,

        @Size(max = 500)
        String bandeiraUrl,

        @Size(max = 10)
        String grupo
) {
}
