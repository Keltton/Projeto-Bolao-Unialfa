package com.grupo7.bolao.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Record que representa os dados recebidos na requisição para cadastrar ou atualizar uma Seleção.
 *
 * @param nome O nome da seleção (ex: "Brasil"). Não pode estar em branco e tem limite de 100 caracteres.
 * @param codigoFifa O código FIFA da seleção com exatamente 3 caracteres (ex: "BRA"). Não pode estar em branco.
 * @param bandeiraUrl Link ou URI da imagem contendo a bandeira da seleção. Opcional, limite de 500 caracteres.
 * @param grupo O grupo ao qual a seleção pertence na primeira fase da competição (ex: "A", "B"). Limite de 10 caracteres.
 */
public record SelecaoRequest(
        @NotBlank
        @Size(max = 100)
        String nome,

        @NotBlank
        @Size(min = 3, max = 3)
        String codigoFifa,

        @Size(max = 500)
        String bandeiraUrl,

        @Size(max = 10)
        String grupo
) {
}
