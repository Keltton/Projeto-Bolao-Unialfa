package com.grupo7.bolao.dto.response;

public record UsuarioRankingResponse(
    Long id,
    String nome,
    String avatarUrl,
    Integer pontuacaoTotal,
    Integer placaresExatos,
    Integer posicao
) {}
