package com.grupo7.bolao.dto.request;

public record EditarPerfilRequest(
        String nome,
        String avatarUrl,
        String email,
        String senhaAtual,
        String novaSenha
) {}
