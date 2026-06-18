package com.grupo7.bolao.service.auth;
import com.grupo7.bolao.dto.request.LoginRequest;
import com.grupo7.bolao.dto.request.RegisterRequest;
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

    public UsuarioResponse cadastrar(RegisterRequest req) {
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

    public LoginResponse login(LoginRequest req){
        Usuario usuario = usuarioRepository.findByEmail(req.email())
                .orElseThrow(()->new IllegalArgumentException("Usuario não encontrado"));

        if (usuario.getStatus() != StatusUsuario.ATIVO) {
            throw new IllegalArgumentException("Sua conta está " + usuario.getStatus().name().toLowerCase() + ".");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.senha())
        );

        String token = jwtService.gerarToken(usuario);

        return new LoginResponse(token, new UsuarioResponse(
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
        ));
    }
}

