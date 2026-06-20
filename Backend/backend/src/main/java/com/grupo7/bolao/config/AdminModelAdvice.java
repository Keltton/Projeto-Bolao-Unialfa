package com.grupo7.bolao.config;

import com.grupo7.bolao.dto.response.UsuarioResponse;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.repository.UsuarioRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice(basePackages = "com.grupo7.bolao.controller.web")
public class AdminModelAdvice {

    private final UsuarioRepository usuarioRepository;

    public AdminModelAdvice(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @ModelAttribute("usuarioAtual")
    public UsuarioResponse usuarioAtual(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        return usuarioRepository.findById(usuario.getId())
                .map(UsuarioResponse::from)
                .orElseGet(() -> UsuarioResponse.from(usuario));
    }
}
