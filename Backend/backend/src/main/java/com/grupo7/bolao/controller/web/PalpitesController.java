package com.grupo7.bolao.controller.web;

import com.grupo7.bolao.dto.response.PalpiteResponse;
import com.grupo7.bolao.enums.CriterioPontuacao;
import com.grupo7.bolao.service.PalpiteService;
import com.grupo7.bolao.service.PartidaService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/admin/palpites")
public class PalpitesController {

    private final PalpiteService palpiteService;
    private final PartidaService partidaService;

    public PalpitesController(PalpiteService palpiteService, PartidaService partidaService) {
        this.palpiteService = palpiteService;
        this.partidaService = partidaService;
    }

    @GetMapping({"", "/"})
    public String listar(
            @RequestParam(required = false) Long partidaId,
            @RequestParam(required = false) CriterioPontuacao criterio,
            @RequestParam(required = false) String busca,
            Model model
    ) {
        List<PalpiteResponse> palpites = palpiteService.listarPalpites(partidaId, criterio, busca);

        model.addAttribute("palpites", palpites);
        model.addAttribute("partidas", partidaService.listarTodasPartidas());
        model.addAttribute("criterios", CriterioPontuacao.values());
        model.addAttribute("partidaFiltro", partidaId);
        model.addAttribute("criterioFiltro", criterio);
        model.addAttribute("busca", busca);
        return "admin/palpites/index";
    }
}
