package com.grupo7.bolao.dto.response;

import java.util.List;

public record RankingResponse(
    List<UsuarioRankingResponse> ranking,
    int paginaAtual,
    int totalPaginas,
    long totalElementos,
    Integer posicaoUsuarioAutenticado
) {}
