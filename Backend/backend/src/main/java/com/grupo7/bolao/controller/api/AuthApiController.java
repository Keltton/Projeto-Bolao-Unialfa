package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.request.LoginRequest;
import com.grupo7.bolao.dto.request.RecuperarSenhaRequest;
import com.grupo7.bolao.dto.request.RedefinirSenhaRequest;
import com.grupo7.bolao.dto.request.UsuarioRequest;
import com.grupo7.bolao.service.RecuperacaoSenhaService;
import com.grupo7.bolao.service.auth.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {
    private final AuthService authService;
    private final RecuperacaoSenhaService recuperacaoSenhaService;

    public AuthApiController(AuthService authService, RecuperacaoSenhaService recuperacaoSenhaService) {
        this.authService = authService;
        this.recuperacaoSenhaService = recuperacaoSenhaService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UsuarioRequest req) {
        return ResponseEntity.ok(authService.cadastrar(req));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<Map<String, String>> recuperarSenha(
            @Valid @RequestBody RecuperarSenhaRequest req) {
        recuperacaoSenhaService.solicitarRecuperacao(req.email());
        return ResponseEntity.ok(Map.of("mensagem",
                "Se este e-mail estiver cadastrado, você receberá as instruções em breve."));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Map<String, String>> redefinirSenha(
            @Valid @RequestBody RedefinirSenhaRequest req) {
        recuperacaoSenhaService.redefinirSenha(req.codigo(), req.novaSenha());
        return ResponseEntity.ok(Map.of("mensagem", "Senha redefinida com sucesso."));
    }
}
