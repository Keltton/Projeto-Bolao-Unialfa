package com.grupo7.bolao.service.auth;
import com.grupo7.bolao.dto.request.LoginRequest;
import com.grupo7.bolao.dto.request.UsuarioRequest;
import com.grupo7.bolao.dto.response.LoginResponse;
import com.grupo7.bolao.dto.response.UsuarioResponse;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.repository.UsuarioRepository;
import com.grupo7.bolao.enums.PerfilUsuario;
import com.grupo7.bolao.enums.StatusUsuario;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    //cadastro de usuario
    public UsuarioResponse cadastrar(UsuarioRequest req) {
        if (usuarioRepository.existsByEmail(req.email())){
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(req.nome());
        usuario.setEmail(req.email());
        usuario.setAvatarUrl(req.avatarUrl());
        usuario.setSenhaHash(passwordEncoder.encode(req.senha()));
        usuario.setPerfil(PerfilUsuario.USUARIO);

        usuarioRepository.save(usuario);

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getAvatarUrl(),
                usuario.getPerfil(),
                usuario.getStatus(),
                usuario.getPontuacaoTotal(),
                usuario.getPlacaresExatos(),
                usuario.getUltimoLoginEm(),
                usuario.getCriadoEm(),
                usuario.getAtualizadoEm()
        );

    }

    //login do usuario, chamando o gerador de token
    public LoginResponse login(LoginRequest req){
        Usuario usuario = usuarioRepository.findByEmail(req.email())
                .orElseThrow(()->new IllegalArgumentException("Usuario não encontrado"));

        //se o usuario não estiver ativo, erro
        if (usuario.getStatus() != StatusUsuario.ATIVO) {
            throw new IllegalArgumentException("Sua conta está " + usuario.getStatus().name().toLowerCase() + ".");
        }

        //autentica a senha
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.senha()));

        //setando o ultimo login
        usuario.setUltimoLoginEm(LocalDateTime.now());
        usuarioRepository.save(usuario);

        //chamando o gerador de token em jwtService
        String token = jwtService.gerarToken(usuario);

        return new LoginResponse(token, UsuarioResponse.from(usuario));
    }
}

