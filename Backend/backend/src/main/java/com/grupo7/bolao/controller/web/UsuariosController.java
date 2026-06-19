package com.grupo7.bolao.controller.web;

import com.grupo7.bolao.dto.response.UsuarioResponse;
import com.grupo7.bolao.enums.StatusUsuario;
import com.grupo7.bolao.service.UsuarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

@Controller
@RequestMapping("/admin/usuarios")
public class UsuariosController {

    private final UsuarioService usuarioService;

    public UsuariosController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping({"", "/"})
    public String listar(
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanho,
            Model model
    ) {
        Pageable pageable = PageRequest.of(pagina, tamanho);
        Page<UsuarioResponse> usuarios = usuarioService.listarUsuarios(busca, pageable);
        model.addAttribute("usuarios", usuarios);
        model.addAttribute("busca", busca);
        model.addAttribute("paginaAtual", pagina);
        return "admin/usuarios/index";
    }


    @PostMapping("/{id}/status")
    public String alterarStatus(@PathVariable Long id, @RequestParam StatusUsuario status) {
        usuarioService.alterarStatusUsuario(id, status);
        return "redirect:/admin/usuarios";
    }
}
