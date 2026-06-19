package com.grupo7.bolao.dto.request;

import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * Record que representa os dados de entrada para cadastrar ou atualizar uma Partida.
 * Contém validações para garantir a consistência das informações antes de persistir no banco.
 *
 * @param selecaoAId ID da primeira seleção (Seleção A). Não pode ser nulo.
 * @param selecaoBId ID da segunda seleção (Seleção B). Não pode ser nulo.
 * @param dataHora Data e hora em que a partida está agendada para iniciar. Não pode ser nulo.
 * @param estadio Nome do estádio onde ocorrerá o jogo. Limite de 150 caracteres.
 * @param fase Fase da competição à qual a partida pertence (ex: GRUPOS, OITAVAS). Não pode ser nulo.
 * @param grupo Grupo da primeira fase ao qual pertence o jogo (opcional). Limite de 10 caracteres.
 * @param status Status atual da partida (ex: AGENDADA, ANDAMENTO, ENCERRADA).
 */
public record PartidaRequest(
        @NotNull
        Long selecaoAId,

        @NotNull
        Long selecaoBId,

        @NotNull
        LocalDateTime dataHora,

        @Size(max = 150)
        String estadio,

        @NotNull
        FasePartida fase,

        @Size(max = 10)
        String grupo,

        StatusPartida status
) {
}
