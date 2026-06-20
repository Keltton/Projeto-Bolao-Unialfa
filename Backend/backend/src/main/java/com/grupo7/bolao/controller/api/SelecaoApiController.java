package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.response.SelecaoResponse;
import com.grupo7.bolao.service.SelecaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * API REST Controller para gerenciamento de Seleções para usuários comuns (App Mobile).
 * Disponibiliza endpoints para consulta, listagem com filtros e contagem de registros.
 */
@RestController
@RequestMapping("/api/selecoes")
public class SelecaoApiController {
    private final SelecaoService selecaoService;

    /**
     * Construtor do SelecaoApiController com injeção de dependências.
     *
     * @param selecaoService Serviço de seleções.
     */
    public SelecaoApiController(SelecaoService selecaoService) {
        this.selecaoService = selecaoService;
    }

    /**
     * Endpoint GET que lista as seleções cadastradas. Permite filtrar opcionalmente por nome ou grupo.
     * Inclui o cabeçalho HTTP "X-Total-Count" indicando a quantidade total de seleções no banco de dados.
     *
     * @param nome Filtro opcional por nome da seleção.
     * @param grupo Filtro opcional por grupo da seleção (ex: "A", "B").
     * @return ResponseEntity contendo a lista de seleções e o header X-Total-Count.
     */
    @GetMapping
    public ResponseEntity<List<SelecaoResponse>> listarTodas(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String grupo) {
        List<SelecaoResponse> selecoes = selecaoService.listarSelecoes(nome, grupo);
        long total = selecaoService.obterTotalSelecoes();

        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(total))
                .body(selecoes);
    }

    /**
     * Endpoint GET que retorna a contagem total de seleções cadastradas.
     *
     * @return ResponseEntity contendo a quantidade total de seleções registradas.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> obterTotal() {
        return ResponseEntity.ok(selecaoService.obterTotalSelecoes());
    }

    /**
     * Endpoint GET que busca os detalhes de uma seleção específica pelo seu ID.
     *
     * @param id O ID da seleção a ser buscada.
     * @return ResponseEntity contendo os dados da seleção correspondente.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SelecaoResponse> buscarPorId(@PathVariable Long id) {
        SelecaoResponse selecao = selecaoService.buscarSelecaoPorId(id);
        return ResponseEntity.ok(selecao);
    }
}
