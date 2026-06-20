package com.grupo7.bolao.service;

import com.grupo7.bolao.model.TokenRecuperacaoSenha;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.repository.TokenRecuperacaoSenhaRepository;
import com.grupo7.bolao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RecuperacaoSenhaService {

    private final UsuarioRepository usuarioRepository;
    private final TokenRecuperacaoSenhaRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${recuperacao.senha.expiracao.minutos:30}")
    private int expiracaoMinutos;

    @Value("${recuperacao.senha.url.base:http://localhost:8080}")
    private String urlBase;

    public RecuperacaoSenhaService(UsuarioRepository usuarioRepository,
                                   TokenRecuperacaoSenhaRepository tokenRepository,
                                   EmailService emailService,
                                   PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void solicitarRecuperacao(String email) {
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            tokenRepository.deleteByUsuarioId(usuario.getId());

            String codigo = UUID.randomUUID().toString();

            TokenRecuperacaoSenha token = new TokenRecuperacaoSenha();
            token.setUsuario(usuario);
            token.setTokenHash(codigo);
            token.setExpiraEm(LocalDateTime.now().plusMinutes(expiracaoMinutos));
            tokenRepository.save(token);

            String link = urlBase + "/resetar-senha?token=" + codigo;
            emailService.enviarRecuperacaoSenha(email, link);
        });
    }

    @Transactional
    public void redefinirSenha(String codigo, String novaSenha) {
        TokenRecuperacaoSenha token = tokenRepository.findByTokenHash(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido."));

        if (token.getUsadoEm() != null) {
            throw new IllegalArgumentException("Este link já foi utilizado.");
        }

        if (LocalDateTime.now().isAfter(token.getExpiraEm())) {
            throw new IllegalArgumentException("Este link expirou. Solicite um novo.");
        }

        Usuario usuario = token.getUsuario();
        usuario.setSenhaHash(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        token.setUsadoEm(LocalDateTime.now());
        tokenRepository.save(token);
    }
}
