package com.grupo7.bolao.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    @GetMapping("/")
    public String index() {
        return "redirect:/admin";
    }

    @GetMapping("/login")
    public String login(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "logout", required = false) String logout,
            Model model
    ) {
        if (error != null) {
            model.addAttribute("erro", "E-mail ou senha inválidos.");
        }
        if (logout != null) {
            model.addAttribute("sucesso", "Logout realizado com sucesso.");
        }
        return "auth/login";
    }

    @GetMapping("/recuperar-senha")
    public String recuperarSenha() {
        return "auth/recuperar-senha";
    }

    @GetMapping("/resetar-senha")
    public String resetarSenha() {
        return "auth/resetar-senha";
    }
}
