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

/**
 * Controller Web (MVC) para a administração das Partidas no painel de controle.
 * Permite a visualização, inserção, edição, lançamento de resultados e exclusão de confrontos.
 */
@Controller
@RequestMapping("/admin/partidas")
public class PartidasController {

    private static final DateTimeFormatter DATA_HORA_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

    private final PartidaService partidaService;
    private final SelecaoService selecaoService;

    /**
     * Construtor do PartidasController.
     *
     * @param partidaService Serviço de regras de negócio de partidas.
     * @param selecaoService Serviço de regras de negócio de seleções.
     */
    public PartidasController(PartidaService partidaService, SelecaoService selecaoService) {
        this.partidaService = partidaService;
        this.selecaoService = selecaoService;
    }

    /**
     * Renderiza a página principal do painel de partidas (listagem geral e filtros).
     *
     * @param fase Filtro opcional por fase do torneio.
     * @param status Filtro opcional por status do jogo.
     * @param model Objeto Model do Spring para passar atributos à view.
     * @return O template Thymeleaf "admin/partidas/index".
     */
    @GetMapping({"", "/"})
    public String listar(
            @RequestParam(required = false) FasePartida fase,
            @RequestParam(required = false) StatusPartida status,
            @RequestParam(required = false) Long selecaoId,
            Model model
    ) {
        List<PartidaResponse> partidas = filtrarPartidas(fase, status, selecaoId);

        model.addAttribute("partidas", partidas);
        model.addAttribute("selecoes", selecaoService.listarTodasSelecoes());
        model.addAttribute("fases", FasePartida.values());
        model.addAttribute("statusList", StatusPartida.values());
        model.addAttribute("faseFiltro", fase);
        model.addAttribute("statusFiltro", status);
        return "admin/partidas/index";
    }

    /**
     * Trata a requisição de cadastro de uma nova partida no painel administrativo.
     *
     * @param selecaoAId ID da Seleção A.
     * @param selecaoBId ID da Seleção B.
     * @param dataHora String de data/hora a ser convertida.
     * @param estadio Nome do estádio.
     * @param fase Fase do torneio.
     * @param grupo Grupo da primeira fase (se aplicável).
     * @param status Status do jogo.
     * @param redirectAttributes Atributos de redirecionamento.
     * @return Redirecionamento para a rota da listagem.
     */
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

    /**
     * Trata a requisição de atualização dos dados cadastrais de uma partida.
     *
     * @param id ID da partida.
     * @param selecaoAId ID atualizado da Seleção A.
     * @param selecaoBId ID atualizado da Seleção B.
     * @param dataHora Data/hora atualizada.
     * @param estadio Estádio atualizado.
     * @param fase Fase atualizada.
     * @param grupo Grupo atualizado.
     * @param status Status atualizado.
     * @param redirectAttributes Atributos de redirecionamento.
     * @return Redirecionamento para a rota da listagem.
     */
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

    /**
     * Trata o lançamento do resultado oficial do confronto, encerrando a partida e atualizando palpites.
     *
     * @param id ID da partida.
     * @param golsSelecaoA Gols marcados pela equipe A.
     * @param golsSelecaoB Gols marcados pela equipe B.
     * @param redirectAttributes Atributos de redirecionamento.
     * @return Redirecionamento para a rota da listagem.
     */
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

    /**
     * Trata a requisição de exclusão de uma partida.
     *
     * @param id ID da partida.
     * @param redirectAttributes Atributos de redirecionamento.
     * @return Redirecionamento para a rota da listagem.
     */
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

    /**
     * Auxiliar de filtragem interna baseada em fase e/ou status.
     */
    private List<PartidaResponse> filtrarPartidas(FasePartida fase, StatusPartida status, Long selecaoId) {
        List<PartidaResponse> partidas;
        if (selecaoId != null) {
            partidas = partidaService.listarPorSelecao(selecaoId);
        } else if (fase != null && status != null) {
            partidas = partidaService.listarPorFaseEStatus(fase, status);
        } else if (fase != null) {
            partidas = partidaService.listarPorFase(fase);
        } else if (status != null) {
            partidas = partidaService.listarPorStatus(status);
        } else {
            partidas = partidaService.listarTodasPartidas();
        }
        return partidas.stream()
                .filter(p -> fase == null || p.fase() == fase)
                .filter(p -> status == null || p.status() == status)
                .toList();
    }

    /**
     * Constrói e valida o DTO {@link PartidaRequest} a partir dos parâmetros HTTP.
     */
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

    /**
     * Formata mensagens de erro de parsing de data de forma amigável.
     */
    private String mensagemErro(Exception e) {
        if (e instanceof DateTimeParseException) {
            return "Data e hora inválidas.";
        }
        return e.getMessage();
    }
}
