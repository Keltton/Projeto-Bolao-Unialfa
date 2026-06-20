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

    //atualiza os dados do perfil do usuario logado
    @PutMapping("/me")
    public ResponseEntity<UsuarioResponse> editarPerfil(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody EditarPerfilRequest request) {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(usuarioLogado.getId(), request ));
    }

    //remove a conta do usuario
    @DeleteMapping("/me/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        usuarioService.remover(id);
        return ResponseEntity.noContent().build();
    }

}
