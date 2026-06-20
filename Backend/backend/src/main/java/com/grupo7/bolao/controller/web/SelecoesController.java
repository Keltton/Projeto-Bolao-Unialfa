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

/**
 * Controller Web (MVC) para a administração das Seleções no painel de controle.
 * Permite a visualização, inserção, edição e exclusão de seleções com upload de imagens de bandeiras.
 */
@Controller
@RequestMapping("/admin/selecoes")
public class SelecoesController {

    private final SelecaoService selecaoService;
    private final ArquivoStorageService arquivoStorageService;

    /**
     * Construtor do SelecoesController.
     *
     * @param selecaoService Serviço de regras de negócio de seleções.
     * @param arquivoStorageService Serviço para upload/gerenciamento de arquivos locais.
     */
    public SelecoesController(SelecaoService selecaoService, ArquivoStorageService arquivoStorageService) {
        this.selecaoService = selecaoService;
        this.arquivoStorageService = arquivoStorageService;
    }

    /**
     * Renderiza a página principal do painel de seleções (listagem geral).
     *
     * @param busca Termo opcional para busca.
     * @param model Objeto Model do Spring para passar atributos à view.
     * @return O template Thymeleaf "admin/selecoes/index".
     */
    @GetMapping({"", "/"})
    public String listar(
            @RequestParam(required = false) String busca,
            Model model
    ) {
        List<SelecaoResponse> selecoes = selecaoService.listarSelecoes(busca);

        model.addAttribute("selecoes", selecoes);
        model.addAttribute("busca", busca);
        return "admin/selecoes/index";
    }

    /**
     * Trata o envio de formulário para cadastrar uma nova seleção, incluindo upload de bandeira.
     *
     * @param nome Nome do país/seleção.
     * @param codigoFifa Código de 3 letras da FIFA.
     * @param grupo Grupo da primeira fase.
     * @param bandeira Arquivo binário da bandeira enviado via formulário multipart.
     * @param redirectAttributes Atributos de redirecionamento para mensagens flash de sucesso/erro.
     * @return Redirecionamento para a rota da listagem.
     */
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

    /**
     * Trata o envio de formulário para atualizar os dados de uma seleção existente.
     *
     * @param id ID da seleção.
     * @param nome Nome atualizado da seleção.
     * @param codigoFifa Código atualizado da FIFA.
     * @param grupo Grupo atualizado.
     * @param bandeiraUrlAtual URL atual da bandeira para manter caso nenhuma nova imagem seja enviada.
     * @param bandeira Novo arquivo binário opcional de bandeira.
     * @param redirectAttributes Atributos de redirecionamento.
     * @return Redirecionamento para a rota da listagem.
     */
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

    /**
     * Trata a requisição de exclusão de uma seleção pelo ID.
     *
     * @param id ID da seleção a ser excluída.
     * @param redirectAttributes Atributos de redirecionamento.
     * @return Redirecionamento para a rota da listagem.
     */
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

    /**
     * Método auxiliar de validação simples de campos obrigatórios no controlador.
     */
    private void validarCampos(String nome, String codigoFifa) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("O nome é obrigatório.");
        }
        if (codigoFifa == null || codigoFifa.trim().length() != 3) {
            throw new IllegalArgumentException("O código FIFA deve ter exatamente 3 caracteres.");
        }
    }
}
