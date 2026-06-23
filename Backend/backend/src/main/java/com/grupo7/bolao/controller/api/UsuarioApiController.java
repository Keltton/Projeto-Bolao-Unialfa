package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.request.EditarPerfilRequest;
import com.grupo7.bolao.dto.response.UsuarioResponse;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

//CONTROLLER da API direcionamento da rota pra consumo de API voltada ao usuario comum
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioApiController {
    private final UsuarioService usuarioService;

    public UsuarioApiController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> obterPerfil(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(usuarioService.obterDetalhesUsuario(usuarioLogado.getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioResponse> editarPerfil(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody EditarPerfilRequest request) {
        return ResponseEntity.ok(usuarioService.editarPerfil(usuarioLogado.getId(), request));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> remover(@AuthenticationPrincipal Usuario usuarioLogado) {
        usuarioService.excluirContaPropria(usuarioLogado.getId());
        return ResponseEntity.noContent().build();
    }

}
