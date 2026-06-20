package com.grupo7.bolao.dto.response;

import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;

import java.time.LocalDateTime;

/**
 * Record que representa os dados detalhados de resposta de uma Partida.
 * Retorna as informações completas incluindo as seleções associadas como DTOs aninhados.
 *
 * @param id ID único da partida.
 * @param selecaoA Dados detalhados da Seleção A {@link SelecaoResponse}.
 * @param selecaoB Dados detalhados da Seleção B {@link SelecaoResponse}.
 * @param dataHora Data e hora agendada.
 * @param estadio Estádio do jogo.
 * @param fase Fase do torneio.
 * @param grupo Grupo da primeira fase.
 * @param status Status atual da partida.
 * @param golsSelecaoA Gols marcados pela Seleção A (pode ser nulo caso não tenha iniciado/concluído).
 * @param golsSelecaoB Gols marcados pela Seleção B (pode ser nulo caso não tenha iniciado/concluído).
 * @param criadoEm Data de criação do registro no banco de dados.
 * @param atualizadoEm Data da última atualização do registro.
 */
public record PartidaResponse(
        Long id,
        SelecaoResponse selecaoA,
        SelecaoResponse selecaoB,
        LocalDateTime dataHora,
        String estadio,
        FasePartida fase,
        String grupo,
        StatusPartida status,
        Integer golsSelecaoA,
        Integer golsSelecaoB,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
