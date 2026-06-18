package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.request.PartidaRequest;
import com.grupo7.bolao.dto.request.ResultadoPartidaRequest;
import com.grupo7.bolao.dto.response.PartidaResponse;
import com.grupo7.bolao.service.PartidaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/partidas")
public class AdminPartidaApiController {

    private final PartidaService partidaService;

    public AdminPartidaApiController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    @PostMapping
    public ResponseEntity<PartidaResponse> cadastrar(@Valid @RequestBody PartidaRequest request) {
        PartidaResponse partida = partidaService.cadastrarPartida(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(partida);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PartidaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody PartidaRequest request) {
        return ResponseEntity.ok(partidaService.atualizarPartida(id, request));
    }

    @PatchMapping("/{id}/resultado")
    public ResponseEntity<PartidaResponse> lancarResultado(
            @PathVariable Long id,
            @Valid @RequestBody ResultadoPartidaRequest request
    ) {
        return ResponseEntity.ok(partidaService.lancarResultado(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        partidaService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
