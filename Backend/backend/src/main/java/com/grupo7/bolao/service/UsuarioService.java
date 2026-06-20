package com.grupo7.bolao.service;

import com.grupo7.bolao.dto.request.EditarPerfilRequest;
import com.grupo7.bolao.dto.response.RankingResponse;
import com.grupo7.bolao.dto.response.UsuarioRankingResponse;
import com.grupo7.bolao.dto.response.UsuarioResponse;
import com.grupo7.bolao.enums.PerfilUsuario;
import com.grupo7.bolao.enums.StatusUsuario;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.repository.UsuarioRepository;
import jakarta.validation.Valid;
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
    private final PasswordEncoder senhaEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder senhaEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.senhaEncoder = senhaEncoder;
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

    //lissta de usuarios paginada
    public Page<UsuarioResponse> listarUsuarios(String busca, StatusUsuario status, Pageable pageable) {
        Page<Usuario> pageUsuarios;
        if (busca != null && !busca.trim().isEmpty()) {
            pageUsuarios = usuarioRepository.findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    busca, busca, pageable);
        } else {
            pageUsuarios = usuarioRepository.findAll(pageable);
        }

        List<UsuarioResponse> usuariosFiltrados = pageUsuarios.getContent().stream()
                .filter(u -> u.getPerfil() != PerfilUsuario.ADMIN)
                .filter(u -> status == null || u.getStatus() == status)
                .map(this::toResponse)
                .toList();

        return new PageImpl<>(usuariosFiltrados, pageable, pageUsuarios.getTotalElements());
    }

    //busca por id
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

    //UPDATE, este aqui seria um update de usuario mais "completo"
    public UsuarioResponse atualizarUsuario(Long id, @Valid EditarPerfilRequest request){
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));

        if (!usuario.getEmail().equals(request.email())
                && usuarioRepository.existsByEmail(request.email()))
        {
            throw new IllegalArgumentException("Este Email já está cadastrado em um usuario");
        }

        usuario.setNome(request.nome());
        usuario.setAvatarUrl(request.avatarUrl());
        usuario.setEmail(request.email());
        usuario.setSenhaHash(senhaEncoder.encode(request.senha()));
        usuario.setAtualizadoEm(java.time.LocalDateTime.now());

        return toResponse(usuarioRepository.save(usuario));
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
