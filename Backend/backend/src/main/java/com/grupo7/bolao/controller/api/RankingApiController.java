package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.response.RankingResponse;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ranking")
public class RankingApiController {

    private final UsuarioService usuarioService;

    public RankingApiController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<RankingResponse> obterRanking(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "50") int tamanho,
            @AuthenticationPrincipal Usuario usuarioAutenticado
    ) {
        return ResponseEntity.ok(usuarioService.obterRankingGeral(pagina, tamanho, usuarioAutenticado));
    }
}
