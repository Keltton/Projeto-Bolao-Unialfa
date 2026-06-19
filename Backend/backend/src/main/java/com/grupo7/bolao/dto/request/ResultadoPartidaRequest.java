package com.grupo7.bolao.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Record que representa a requisição para registrar o resultado final de gols em uma Partida.
 * Utilizado pelos administradores para atualizar o placar do jogo e disparar o recálculo de palpites.
 *
 * @param golsSelecaoA Gols marcados pela Seleção A. Não pode ser nulo e deve ser maior ou igual a zero.
 * @param golsSelecaoB Gols marcados pela Seleção B. Não pode ser nulo e deve ser maior ou igual a zero.
 */
public record ResultadoPartidaRequest(
        @NotNull
        @Min(0)
        Integer golsSelecaoA,

        @NotNull
        @Min(0)
        Integer golsSelecaoB
) {
}
