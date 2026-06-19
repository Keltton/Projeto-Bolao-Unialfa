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

/**
 * API REST Controller para obter a classificação do ranking geral dos usuários no Bolão.
 * Fornece endpoints de consulta para montar a tabela de liderança com paginação e destaque do usuário logado.
 */
@RestController
@RequestMapping("/api/ranking")
public class RankingApiController {

    private final UsuarioService usuarioService;

    /**
     * Construtor do RankingApiController.
     *
     * @param usuarioService Serviço de regras de negócio associadas aos usuários e pontuações.
     */
    public RankingApiController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Endpoint GET que retorna a classificação geral de pontuação dos usuários cadastrados de forma paginada.
     * Destaca a posição atual e dados do usuário que está fazendo a requisição.
     *
     * @param pagina Página atual da consulta (iniciada em 0, padrão é 0).
     * @param tamanho Quantidade de registros retornados por página (padrão é 50).
     * @param usuarioAutenticado Detalhes do usuário autenticado no contexto de segurança obtido via JWT.
     * @return ResponseEntity contendo a estrutura {@link RankingResponse} com ranking paginado e status do usuário logado.
     */
    @GetMapping
    public ResponseEntity<RankingResponse> obterRanking(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "50") int tamanho,
            @AuthenticationPrincipal Usuario usuarioAutenticado
    ) {
        return ResponseEntity.ok(usuarioService.obterRankingGeral(pagina, tamanho, usuarioAutenticado));
    }
}
