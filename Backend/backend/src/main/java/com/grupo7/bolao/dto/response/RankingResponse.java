package com.grupo7.bolao.dto.response;

import java.util.List;

/**
 * Record que representa a resposta do ranking geral contendo a classificação paginada dos participantes
 * e a colocação atual do usuário que realizou a busca.
 *
 * @param ranking Lista paginada contendo as posições de classificação com {@link UsuarioRankingResponse}.
 * @param paginaAtual Página atual da paginação iniciada em zero.
 * @param totalPaginas Quantidade total de páginas disponíveis.
 * @param totalElementos Total de usuários participantes incluídos no ranking geral.
 * @param posicaoUsuarioAutenticado Colocação do usuário logado na classificação global (pode ser nulo se não houver usuário logado).
 */
public record RankingResponse(
    List<UsuarioRankingResponse> ranking,
    int paginaAtual,
    int totalPaginas,
    long totalElementos,
    Integer posicaoUsuarioAutenticado
) {}
