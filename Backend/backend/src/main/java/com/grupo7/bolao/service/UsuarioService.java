package com.grupo7.bolao.service;

import com.grupo7.bolao.dto.request.EditarPerfilRequest;
import com.grupo7.bolao.dto.response.RankingResponse;
import com.grupo7.bolao.dto.response.UsuarioRankingResponse;
import com.grupo7.bolao.dto.response.UsuarioResponse;
import com.grupo7.bolao.enums.PerfilUsuario;
import com.grupo7.bolao.enums.StatusUsuario;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.repository.PalpiteRepository;
import com.grupo7.bolao.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

//service do usuario, RN
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PalpiteRepository palpiteRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PalpiteRepository palpiteRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.palpiteRepository = palpiteRepository;
    }

    //pega o ranking por pontos e faz a paginação dos dados
    public RankingResponse obterRankingGeral(int pagina, int tamanho, Usuario usuarioAutenticado) {
        Pageable pageable = PageRequest.of(pagina, tamanho);
        Page<Usuario> pageUsuarios = usuarioRepository.findByPerfilAndStatusOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc(
                PerfilUsuario.USUARIO,
                StatusUsuario.ATIVO,
                pageable
        );

        int offset = pagina * tamanho;
        List<UsuarioRankingResponse> rankingList = new ArrayList<>();
        List<Usuario> usuarios = pageUsuarios.getContent();

        for (int i = 0; i < usuarios.size(); i++) {
            Usuario u = usuarios.get(i);
            rankingList.add(new UsuarioRankingResponse(
                    u.getId(),
                    u.getNome(),
                    u.getAvatarUrl(),
                    u.getPontuacaoTotal(),
                    u.getPlacaresExatos(),
                    offset + i + 1
            ));
        }

        Integer posicaoAutenticado = null;
        if (usuarioAutenticado != null && usuarioAutenticado.getPerfil() == PerfilUsuario.USUARIO && usuarioAutenticado.getStatus() == StatusUsuario.ATIVO) {
            posicaoAutenticado = (int) usuarioRepository.obterPosicaoNoRanking(
                    usuarioAutenticado.getPontuacaoTotal(),
                    usuarioAutenticado.getPlacaresExatos(),
                    usuarioAutenticado.getCriadoEm()
            );
        }

        return new RankingResponse(
                rankingList,
                pageUsuarios.getNumber(),
                pageUsuarios.getTotalPages(),
                pageUsuarios.getTotalElements(),
                posicaoAutenticado
        );
    }

    //lista de usuarios paginada
    public Page<UsuarioResponse> listarUsuarios(String busca, StatusUsuario status, Pageable pageable) {
        boolean temBusca = busca != null && !busca.trim().isEmpty();
        Page<Usuario> pageUsuarios;

        if (temBusca && status != null) {
            pageUsuarios = usuarioRepository
                    .findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            busca, busca, status, pageable);
        } else if (temBusca) {
            pageUsuarios = usuarioRepository
                    .findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            busca, busca, StatusUsuario.ATIVO, pageable);
        } else if (status != null) {
            pageUsuarios = usuarioRepository.findByPerfilAndStatusOrderByPontuacaoTotalDescPlacaresExatosDescCriadoEmAsc(
                    PerfilUsuario.USUARIO, status, pageable);
        } else {
            pageUsuarios = usuarioRepository.findAll(pageable);
        }

        List<UsuarioResponse> usuariosFiltrados = pageUsuarios.getContent().stream()
                .filter(u -> u.getPerfil() != PerfilUsuario.ADMIN)
                .map(this::toResponse)
                .toList();

        return new PageImpl<>(usuariosFiltrados, pageable, pageUsuarios.getTotalElements());
    }

    //UPDATE, este aqui seria um update de usuario mais "completo"
    public UsuarioResponse editarPerfil(Long id, EditarPerfilRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));

        if (request.nome() != null && !request.nome().isBlank()) {
            usuario.setNome(request.nome().trim());
        }
        if (request.avatarUrl() != null) {
            usuario.setAvatarUrl(request.avatarUrl());
        }
        if (request.email() != null && !request.email().isBlank()) {
            String email = request.email().trim();
            if (!email.equalsIgnoreCase(usuario.getEmail())) {
                if (usuarioRepository.existsByEmail(email)) {
                    throw new IllegalArgumentException("Este e-mail já está cadastrado.");
                }
                usuario.setEmail(email);
            }
        }

        boolean trocarSenha = request.novaSenha() != null && !request.novaSenha().isBlank();
        if (trocarSenha) {
            if (request.senhaAtual() == null || request.senhaAtual().isBlank()) {
                throw new IllegalArgumentException("Informe a senha atual para definir uma nova senha.");
            }
            if (!passwordEncoder.matches(request.senhaAtual(), usuario.getSenhaHash())) {
                throw new IllegalArgumentException("Senha atual incorreta.");
            }
            if (request.novaSenha().length() < 6) {
                throw new IllegalArgumentException("A nova senha deve ter no mínimo 6 caracteres.");
            }
            usuario.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
        }

        return UsuarioResponse.from(usuarioRepository.save(usuario));
    }

    //busca por id
    public Usuario buscarEntidadePorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));
    }


    public UsuarioResponse obterDetalhesUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));
        return toResponse(usuario);
    }

    //alteração de status, ATIVO -> BLOQUEADO -> ATIVO ..
    public UsuarioResponse alterarStatusUsuario(Long id, StatusUsuario status) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));
        usuario.setStatus(status);
        return toResponse(usuarioRepository.save(usuario));
    }

    //remover, não tem muito o q explicar, só apaga o usuario por id
    public void remover(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));
        usuarioRepository.delete(usuario);
    }

    public void excluirContaPropria(Long id) {
        Usuario usuario = buscarEntidadePorId(id);
        palpiteRepository.deleteByUsuarioId(id); // apaga os palpites primeiro
        usuarioRepository.delete(usuario);        // aí apaga o usuário
    }

    //pra não precisar ficar fazendo esse monte de código toda hora, foi feito o toResponse, ai podemos chama-lo sempre que precisamos
    private UsuarioResponse toResponse(Usuario usuario) {
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
}
