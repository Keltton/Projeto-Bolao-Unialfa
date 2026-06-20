package com.grupo7.bolao.controller.web;

import com.grupo7.bolao.dto.request.EditarPerfilRequest;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.service.ArquivoStorageService;
import com.grupo7.bolao.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URI;

@Controller
@RequestMapping("/admin/perfil")
public class PerfilController {

    private final UsuarioService usuarioService;
    private final ArquivoStorageService arquivoStorageService;

    public PerfilController(UsuarioService usuarioService, ArquivoStorageService arquivoStorageService) {
        this.usuarioService = usuarioService;
        this.arquivoStorageService = arquivoStorageService;
    }

    @PostMapping
    public String atualizar(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam String nome,
            @RequestParam String email,
            @RequestParam(required = false) String senhaAtual,
            @RequestParam(required = false) String novaSenha,
            @RequestParam(required = false) String confirmarSenha,
            @RequestParam(required = false) String avatarUrlAtual,
            @RequestParam(required = false) MultipartFile avatar,
            @RequestHeader(value = "Referer", required = false) String referer,
            HttpServletRequest request,
            RedirectAttributes redirectAttributes
    ) {
        try {
            if (nome == null || nome.isBlank()) {
                throw new IllegalArgumentException("O nome é obrigatório.");
            }
            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("O e-mail é obrigatório.");
            }
            if (novaSenha != null && !novaSenha.isBlank()) {
                if (confirmarSenha == null || !novaSenha.equals(confirmarSenha)) {
                    throw new IllegalArgumentException("A confirmação da senha não confere.");
                }
            }

            String novaAvatarUrl = arquivoStorageService.salvarImagem(avatar, "avatars");
            if (novaAvatarUrl == null) {
                novaAvatarUrl = avatarUrlAtual;
            } else if (usuario.getAvatarUrl() != null && !usuario.getAvatarUrl().equals(novaAvatarUrl)) {
                arquivoStorageService.excluirSeLocal(usuario.getAvatarUrl());
            }

            usuarioService.editarPerfil(
                    usuario.getId(),
                    new EditarPerfilRequest(
                            nome.trim(),
                            novaAvatarUrl,
                            email.trim(),
                            senhaAtual,
                            novaSenha
                    )
            );

            Usuario usuarioAtualizado = usuarioService.buscarEntidadePorId(usuario.getId());
            atualizarSessao(request, usuarioAtualizado);

            redirectAttributes.addFlashAttribute("sucesso", "Perfil atualizado com sucesso.");
        } catch (IllegalArgumentException e) {
            redirectAttributes.addFlashAttribute("erro", e.getMessage());
            redirectAttributes.addFlashAttribute("abrirModalPerfil", true);
        }
        return redirectSeguro(referer);
    }

    private void atualizarSessao(HttpServletRequest request, Usuario usuarioAtualizado) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                usuarioAtualizado,
                null,
                usuarioAtualizado.getAuthorities()
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        var session = request.getSession(false);
        if (session != null) {
            session.setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    context
            );
        }
    }

    private String redirectSeguro(String referer) {
        if (referer != null) {
            try {
                URI uri = URI.create(referer);
                String path = uri.getPath();
                if (path != null && path.startsWith("/admin")) {
                    String destino = path;
                    if (uri.getQuery() != null && !uri.getQuery().isBlank()) {
                        destino += "?" + uri.getQuery();
                    }
                    return "redirect:" + destino;
                }
            } catch (IllegalArgumentException ignored) {
                // fallback abaixo
            }
        }
        return "redirect:/admin";
    }
}
