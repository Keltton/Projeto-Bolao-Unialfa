package com.grupo7.bolao.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RedefinirSenhaRequest(
        @NotBlank(message = "Código é obrigatório")
        @Size(min = 6, max = 6, message = "O código deve ter 6 dígitos")
        String codigo,

        @NotBlank(message = "Nova senha é obrigatória")
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
        String novaSenha
) {}