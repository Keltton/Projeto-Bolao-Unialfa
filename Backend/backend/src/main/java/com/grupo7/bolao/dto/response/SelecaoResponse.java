package com.grupo7.bolao.dto.response;

import java.time.LocalDateTime;

/**
 * Record que representa os dados retornados nas respostas HTTP da API sobre uma Seleção.
 *
 * @param id Identificador único da seleção no banco de dados.
 * @param nome Nome do país/seleção.
 * @param codigoFifa Código oficial da FIFA (composto por 3 letras maiúsculas).
 * @param bandeiraUrl Link ou URI da imagem contendo a bandeira.
 * @param grupo Grupo da primeira fase (ex: "A", "B").
 * @param criadoEm Data e hora de criação do registro no banco de dados.
 * @param atualizadoEm Data e hora da última atualização do registro.
 */
public record SelecaoResponse(
        Long id,
        String nome,
        String codigoFifa,
        String bandeiraUrl,
        String grupo,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
