package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.response.PartidaResponse;
import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;
import com.grupo7.bolao.service.PartidaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * API REST Controller para visualização de Partidas pelo usuário do aplicativo móvel.
 * Disponibiliza endpoints para consulta com diversos parâmetros de filtragem cronológica e de fase.
 */
@RestController
@RequestMapping("/api/partidas")
public class PartidaApiController {

    private final PartidaService partidaService;

    /**
     * Construtor do PartidaApiController.
     *
     * @param partidaService Serviço de regras de negócio de partidas.
     */
    public PartidaApiController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    /**
     * Endpoint GET para listar partidas cadastradas com suporte a diversos filtros acumulados (fase, status ou intervalo de tempo).
     *
     * @param fase Filtro opcional por fase (ex: GRUPOS, OITAVAS).
     * @param status Filtro opcional por status (ex: AGENDADA, ENCERRADA).
     * @param inicio Data e hora de início de intervalo (opcional).
     * @param fim Data e hora de fim de intervalo (opcional).
     * @return ResponseEntity contendo a lista de partidas correspondentes.
     */
    @GetMapping
    public ResponseEntity<List<PartidaResponse>> listarTodas(
            @RequestParam(required = false) FasePartida fase,
            @RequestParam(required = false) StatusPartida status,
            @RequestParam(required = false) LocalDateTime inicio,
            @RequestParam(required = false) LocalDateTime fim
    ) {
        if (fase != null && status != null) {
            return ResponseEntity.ok(partidaService.listarPorFaseEStatus(fase, status));
        }

        if (fase != null) {
            return ResponseEntity.ok(partidaService.listarPorFase(fase));
        }

        if (status != null) {
            return ResponseEntity.ok(partidaService.listarPorStatus(status));
        }

        if (inicio != null && fim != null) {
            return ResponseEntity.ok(partidaService.listarPorPeriodo(inicio, fim));
        }

        return ResponseEntity.ok(partidaService.listarTodasPartidas());
    }

    /**
     * Endpoint GET para obter a lista das próximas partidas agendadas (cronologicamente a partir de agora).
     *
     * @return ResponseEntity contendo a lista de partidas futuras.
     */
    @GetMapping("/proximas")
    public ResponseEntity<List<PartidaResponse>> listarProximas() {
        return ResponseEntity.ok(partidaService.listarProximasPartidas());
    }

    /**
     * Endpoint GET para buscar os detalhes de uma partida específica pelo seu ID.
     *
     * @param id ID da partida.
     * @return ResponseEntity contendo os dados da partida.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PartidaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(partidaService.buscarPartidaPorId(id));
    }
}
