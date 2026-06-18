package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.request.PalpiteRequest;
import com.grupo7.bolao.dto.response.PalpiteResponse;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.service.PalpiteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/palpites")
public class PalpiteApiController {

    private final PalpiteService palpiteService;

    public PalpiteApiController(PalpiteService palpiteService) {
        this.palpiteService = palpiteService;
    }

    @PostMapping
    public ResponseEntity<PalpiteResponse> registrar(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody PalpiteRequest request
    ) {
        PalpiteResponse palpite = palpiteService.registrarPalpite(usuario, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(palpite);
    }

    @GetMapping("/meus")
    public ResponseEntity<List<PalpiteResponse>> listarMeus(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(palpiteService.listarMeusPalpites(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PalpiteResponse> buscarMeuPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.ok(palpiteService.buscarMeuPalpitePorId(id, usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PalpiteResponse> editar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody PalpiteRequest request
    ) {
        return ResponseEntity.ok(palpiteService.editarPalpite(id, usuario, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario
    ) {
        palpiteService.removerPalpite(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
