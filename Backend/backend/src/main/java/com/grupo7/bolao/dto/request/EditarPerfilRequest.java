package com.grupo7.bolao.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record EditarPerfilRequest(
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
        String nome,

        String avatarUrl,

        @Email(message = "E-mail inválido")
        String email,

        String senhaAtual,

        @Size(min = 6, message = "A nova senha deve ter no mínimo 6 caracteres")
        String novaSenha
) {}