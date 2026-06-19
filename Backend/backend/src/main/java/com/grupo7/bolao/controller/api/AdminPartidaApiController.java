package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.request.PartidaRequest;
import com.grupo7.bolao.dto.request.ResultadoPartidaRequest;
import com.grupo7.bolao.dto.response.PartidaResponse;
import com.grupo7.bolao.service.PartidaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * API REST Controller para administração de Partidas.
 * Oferece endpoints restritos para cadastrar, atualizar dados, excluir e lançar o resultado final de partidas de futebol.
 */
@RestController
@RequestMapping("/api/admin/partidas")
public class AdminPartidaApiController {

    private final PartidaService partidaService;

    /**
     * Construtor do AdminPartidaApiController.
     *
     * @param partidaService Serviço de regras de negócio de partidas.
     */
    public AdminPartidaApiController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    /**
     * Endpoint POST para cadastrar uma nova partida.
     *
     * @param request DTO com as informações da partida.
     * @return ResponseEntity contendo a partida criada com status HTTP 201 Created.
     */
    @PostMapping
    public ResponseEntity<PartidaResponse> cadastrar(@Valid @RequestBody PartidaRequest request) {
        PartidaResponse partida = partidaService.cadastrarPartida(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(partida);
    }

    /**
     * Endpoint PUT para atualizar dados de uma partida existente pelo ID.
     *
     * @param id ID da partida.
     * @param request DTO com as novas informações da partida.
     * @return ResponseEntity com a partida modificada.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PartidaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody PartidaRequest request) {
        return ResponseEntity.ok(partidaService.atualizarPartida(id, request));
    }

    /**
     * Endpoint PATCH para lançar o placar de gols oficial de uma partida e finalizar o jogo.
     *
     * @param id ID da partida.
     * @param request DTO contendo a quantidade de gols marcados pelas seleções.
     * @return ResponseEntity com a partida atualizada e finalizada.
     */
    @PatchMapping("/{id}/resultado")
    public ResponseEntity<PartidaResponse> lancarResultado(
            @PathVariable Long id,
            @Valid @RequestBody ResultadoPartidaRequest request
    ) {
        return ResponseEntity.ok(partidaService.lancarResultado(id, request));
    }

    /**
     * Endpoint DELETE para remover uma partida cadastrada que não possua palpites atrelados.
     *
     * @param id ID da partida.
     * @return ResponseEntity vazio com status HTTP 244 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        partidaService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
