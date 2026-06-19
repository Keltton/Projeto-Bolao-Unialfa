package com.grupo7.bolao.dto.request;

import jakarta.validation.constraints.Size;

public record EditarPerfilRequest(
        String nome,

        String avatarUrl
) {}