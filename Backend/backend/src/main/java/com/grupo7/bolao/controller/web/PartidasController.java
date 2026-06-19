package com.grupo7.bolao.controller.web;

import com.grupo7.bolao.dto.request.PartidaRequest;
import com.grupo7.bolao.dto.request.ResultadoPartidaRequest;
import com.grupo7.bolao.dto.response.PartidaResponse;
import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;
import com.grupo7.bolao.service.PartidaService;
import com.grupo7.bolao.service.SelecaoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Controller
@RequestMapping("/admin/partidas")
public class PartidasController {

    private static final DateTimeFormatter DATA_HORA_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

    private final PartidaService partidaService;
    private final SelecaoService selecaoService;

    public PartidasController(PartidaService partidaService, SelecaoService selecaoService) {
        this.partidaService = partidaService;
        this.selecaoService = selecaoService;
    }

    @GetMapping({"", "/"})
    public String listar(
            @RequestParam(required = false) FasePartida fase,
            @RequestParam(required = false) StatusPartida status,
            Model model
    ) {
        List<PartidaResponse> partidas = filtrarPartidas(fase, status);

        model.addAttribute("partidas", partidas);
        model.addAttribute("selecoes", selecaoService.listarTodasSelecoes());
        model.addAttribute("fases", FasePartida.values());
        model.addAttribute("statusList", StatusPartida.values());
        model.addAttribute("faseFiltro", fase);
        model.addAttribute("statusFiltro", status);
        return "admin/partidas/index";
    }

    @PostMapping
    public String cadastrar(
            @RequestParam Long selecaoAId,
            @RequestParam Long selecaoBId,
            @RequestParam String dataHora,
            @RequestParam(required = false) String estadio,
            @RequestParam FasePartida fase,
            @RequestParam(required = false) String grupo,
            @RequestParam(required = false) StatusPartida status,
            RedirectAttributes redirectAttributes
    ) {
        try {
            PartidaRequest request = montarRequest(selecaoAId, selecaoBId, dataHora, estadio, fase, grupo, status);
            partidaService.cadastrarPartida(request);
            redirectAttributes.addFlashAttribute("sucesso", "Partida cadastrada com sucesso.");
        } catch (IllegalArgumentException | DateTimeParseException e) {
            redirectAttributes.addFlashAttribute("erro", mensagemErro(e));
        }
        return "redirect:/admin/partidas";
    }

    @PostMapping("/{id}")
    public String atualizar(
            @PathVariable Long id,
            @RequestParam Long selecaoAId,
            @RequestParam Long selecaoBId,
            @RequestParam String dataHora,
            @RequestParam(required = false) String estadio,
            @RequestParam FasePartida fase,
            @RequestParam(required = false) String grupo,
            @RequestParam(required = false) StatusPartida status,
            RedirectAttributes redirectAttributes
    ) {
        try {
            PartidaRequest request = montarRequest(selecaoAId, selecaoBId, dataHora, estadio, fase, grupo, status);
            partidaService.atualizarPartida(id, request);
            redirectAttributes.addFlashAttribute("sucesso", "Partida atualizada com sucesso.");
        } catch (IllegalArgumentException | DateTimeParseException e) {
            redirectAttributes.addFlashAttribute("erro", mensagemErro(e));
        }
        return "redirect:/admin/partidas";
    }

    @PostMapping("/{id}/resultado")
    public String lancarResultado(
            @PathVariable Long id,
            @RequestParam Integer golsSelecaoA,
            @RequestParam Integer golsSelecaoB,
            RedirectAttributes redirectAttributes
    ) {
        try {
            if (golsSelecaoA < 0 || golsSelecaoB < 0) {
                throw new IllegalArgumentException("Os gols não podem ser negativos.");
            }
            partidaService.lancarResultado(id, new ResultadoPartidaRequest(golsSelecaoA, golsSelecaoB));
            redirectAttributes.addFlashAttribute("sucesso", "Resultado lançado com sucesso.");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/partidas";
    }

    @PostMapping("/{id}/excluir")
    public String excluir(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes
    ) {
        try {
            partidaService.remover(id);
            redirectAttributes.addFlashAttribute("sucesso", "Partida excluída com sucesso.");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/partidas";
    }

    private List<PartidaResponse> filtrarPartidas(FasePartida fase, StatusPartida status) {
        if (fase != null && status != null) {
            return partidaService.listarPorFaseEStatus(fase, status);
        }
        if (fase != null) {
            return partidaService.listarPorFase(fase);
        }
        if (status != null) {
            return partidaService.listarPorStatus(status);
        }
        return partidaService.listarTodasPartidas();
    }

    private PartidaRequest montarRequest(
            Long selecaoAId,
            Long selecaoBId,
            String dataHora,
            String estadio,
            FasePartida fase,
            String grupo,
            StatusPartida status
    ) {
        if (selecaoAId == null || selecaoBId == null) {
            throw new IllegalArgumentException("Selecione as duas seleções.");
        }
        if (dataHora == null || dataHora.isBlank()) {
            throw new IllegalArgumentException("A data e hora são obrigatórias.");
        }
        if (fase == null) {
            throw new IllegalArgumentException("A fase é obrigatória.");
        }

        LocalDateTime dataHoraPartida = LocalDateTime.parse(dataHora.trim(), DATA_HORA_FORMATTER);
        String estadioNormalizado = estadio != null && !estadio.isBlank() ? estadio.trim() : null;
        String grupoNormalizado = grupo != null && !grupo.isBlank() ? grupo.trim() : null;

        return new PartidaRequest(
                selecaoAId,
                selecaoBId,
                dataHoraPartida,
                estadioNormalizado,
                fase,
                grupoNormalizado,
                status
        );
    }

    private String mensagemErro(Exception e) {
        if (e instanceof DateTimeParseException) {
            return "Data e hora inválidas.";
        }
        return e.getMessage();
    }
}
