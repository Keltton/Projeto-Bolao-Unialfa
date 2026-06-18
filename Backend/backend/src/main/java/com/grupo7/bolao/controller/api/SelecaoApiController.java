package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.response.SelecaoResponse;
import com.grupo7.bolao.service.SelecaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/selecoes")
public class SelecaoApiController {
    private final SelecaoService selecaoService;

    public SelecaoApiController(SelecaoService selecaoService) {
        this.selecaoService = selecaoService;
    }

    @GetMapping
    public ResponseEntity<List<SelecaoResponse>> listarTodas(@RequestParam(required = false) String grupo) {
        if (grupo != null) {
            return ResponseEntity.ok(selecaoService.listarPorGrupo(grupo));
        }

        return ResponseEntity.ok(selecaoService.listarTodasSelecoes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SelecaoResponse> buscarPorId(@PathVariable Long id) {
        SelecaoResponse selecao = selecaoService.buscarSelecaoPorId(id);
        return ResponseEntity.ok(selecao);
    }
}
