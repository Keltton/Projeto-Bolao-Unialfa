package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.request.SelecaoRequest;
import com.grupo7.bolao.dto.response.SelecaoResponse;
import com.grupo7.bolao.service.SelecaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/selecoes")
public class AdminSelecaoApiController {

    private final SelecaoService selecaoService;

    public AdminSelecaoApiController(SelecaoService selecaoService) {
        this.selecaoService = selecaoService;
    }

    @PostMapping
    public ResponseEntity<SelecaoResponse> cadastrar(@Valid @RequestBody SelecaoRequest request) {
        SelecaoResponse selecao = selecaoService.cadastrarSelecao(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(selecao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SelecaoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody SelecaoRequest request) {
        SelecaoResponse selecao = selecaoService.atualizarSelecao(id, request);
        return ResponseEntity.ok(selecao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        selecaoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
