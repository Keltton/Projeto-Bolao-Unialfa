package com.grupo7.bolao.controller.web;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.grupo7.bolao.dto.request.SelecaoRequest;
import com.grupo7.bolao.dto.response.SelecaoResponse;
import com.grupo7.bolao.service.ArquivoStorageService;
import com.grupo7.bolao.service.SelecaoService;

@Controller
@RequestMapping("/admin/selecoes")
public class SelecoesController {

    private final SelecaoService selecaoService;
    private final ArquivoStorageService arquivoStorageService;

    public SelecoesController(SelecaoService selecaoService, ArquivoStorageService arquivoStorageService) {
        this.selecaoService = selecaoService;
        this.arquivoStorageService = arquivoStorageService;
    }

    @GetMapping({"", "/"})
    public String listar(
            @RequestParam(required = false) String busca,
            Model model
    ) {
        List<SelecaoResponse> selecoes = selecaoService.listarTodasSelecoes();

        model.addAttribute("selecoes", selecoes);
        model.addAttribute("busca", busca);
        return "admin/selecoes/index";
    }

    @PostMapping
    public String cadastrar(
            @RequestParam String nome,
            @RequestParam String codigoFifa,
            @RequestParam(required = false) String grupo,
            @RequestParam(required = false) MultipartFile bandeira,
            RedirectAttributes redirectAttributes
    ) {
        try {
            validarCampos(nome, codigoFifa);
            String bandeiraUrl = arquivoStorageService.salvarImagem(bandeira, "bandeiras");
            SelecaoRequest request = new SelecaoRequest(
                    nome.trim(),
                    codigoFifa,
                    bandeiraUrl,
                    grupo != null && !grupo.isBlank() ? grupo.trim() : null
            );
            selecaoService.cadastrarSelecao(request);
            redirectAttributes.addFlashAttribute("sucesso", "Seleção cadastrada com sucesso.");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/selecoes";
    }

    @PostMapping("/{id}")
    public String atualizar(
            @PathVariable Long id,
            @RequestParam String nome,
            @RequestParam String codigoFifa,
            @RequestParam(required = false) String grupo,
            @RequestParam(required = false) String bandeiraUrlAtual,
            @RequestParam(required = false) MultipartFile bandeira,
            RedirectAttributes redirectAttributes
    ) {
        try {
            validarCampos(nome, codigoFifa);
            SelecaoResponse atual = selecaoService.buscarSelecaoPorId(id);

            String novaBandeiraUrl = arquivoStorageService.salvarImagem(bandeira, "bandeiras");
            if (novaBandeiraUrl == null) {
                novaBandeiraUrl = bandeiraUrlAtual;
            } else {
                arquivoStorageService.excluirSeLocal(atual.bandeiraUrl());
            }

            SelecaoRequest request = new SelecaoRequest(
                    nome.trim(),
                    codigoFifa,
                    novaBandeiraUrl,
                    grupo != null && !grupo.isBlank() ? grupo.trim() : null
            );
            selecaoService.atualizarSelecao(id, request);
            redirectAttributes.addFlashAttribute("sucesso", "Seleção atualizada com sucesso.");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/selecoes";
    }

    @PostMapping("/{id}/excluir")
    public String excluir(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes
    ) {
        try {
            SelecaoResponse selecao = selecaoService.buscarSelecaoPorId(id);
            selecaoService.remover(id);
            arquivoStorageService.excluirSeLocal(selecao.bandeiraUrl());
            redirectAttributes.addFlashAttribute("sucesso", "Seleção excluída com sucesso.");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("erro", e.getMessage());
        }
        return "redirect:/admin/selecoes";
    }

    private void validarCampos(String nome, String codigoFifa) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("O nome é obrigatório.");
        }
        if (codigoFifa == null || codigoFifa.trim().length() != 3) {
            throw new IllegalArgumentException("O código FIFA deve ter exatamente 3 caracteres.");
        }
    }
}
