package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.response.UsuarioResponse;
import com.grupo7.bolao.enums.StatusUsuario;
import com.grupo7.bolao.service.UsuarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUsuarioApiController {

    private final UsuarioService usuarioService;

    public AdminUsuarioApiController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<Page<UsuarioResponse>> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "50") int tamanho
    ) {
        Pageable pageable = PageRequest.of(pagina, tamanho);
        return ResponseEntity.ok(usuarioService.listarUsuarios(busca, StatusUsuario.ATIVO, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obterDetalhes(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obterDetalhesUsuario(id));
    }

    @PatchMapping("/{id}/status")

    public ResponseEntity<UsuarioResponse> alterarStatus(

            @PathVariable Long id,

            @RequestParam StatusUsuario status

    ) {
        return ResponseEntity.ok(usuarioService.alterarStatusUsuario(id, status));
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        usuarioService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
