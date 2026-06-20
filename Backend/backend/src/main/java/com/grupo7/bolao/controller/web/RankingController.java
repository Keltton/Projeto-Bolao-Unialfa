package com.grupo7.bolao.controller.web;

import com.grupo7.bolao.dto.response.RankingResponse;
import com.grupo7.bolao.service.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/admin/ranking")
public class RankingController {

    private final UsuarioService usuarioService;

    public RankingController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping({"", "/"})
    public String index(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "50") int tamanho,
            Model model
    ) {
        RankingResponse ranking = usuarioService.obterRankingGeral(pagina, tamanho, null);

        model.addAttribute("ranking", ranking.ranking());
        model.addAttribute("paginaAtual", ranking.paginaAtual());
        model.addAttribute("totalPaginas", ranking.totalPaginas());
        model.addAttribute("totalElementos", ranking.totalElementos());
        return "admin/ranking/index";
    }
}

