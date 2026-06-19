package com.grupo7.bolao.dto.response;

/**
 * Record que representa os dados de pontuação e classificação individual de um usuário exibido no Ranking.
 *
 * @param id ID único do usuário.
 * @param nome Nome de exibição do usuário.
 * @param avatarUrl Link para a imagem do avatar.
 * @param pontuacaoTotal Total de pontos acumulados com palpites corretos.
 * @param placaresExatos Quantidade de palpites onde o placar foi acertado em cheio.
 * @param posicao Posição do usuário na classificação (1º, 2º, etc.).
 */
public record UsuarioRankingResponse(
    Long id,
    String nome,
    String avatarUrl,
    Integer pontuacaoTotal,
    Integer placaresExatos,
    Integer posicao
) {}
