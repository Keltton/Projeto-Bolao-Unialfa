package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.response.PartidaResponse;
import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;
import com.grupo7.bolao.service.PartidaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/partidas")
public class PartidaApiController {

    private final PartidaService partidaService;

    public PartidaApiController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

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

    @GetMapping("/proximas")
    public ResponseEntity<List<PartidaResponse>> listarProximas() {
        return ResponseEntity.ok(partidaService.listarProximasPartidas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartidaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(partidaService.buscarPartidaPorId(id));
    }
}
