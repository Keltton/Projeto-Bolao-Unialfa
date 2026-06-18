package com.grupo7.bolao.service;

import com.grupo7.bolao.dto.response.RankingResponse;
import com.grupo7.bolao.dto.response.UsuarioRankingResponse;
import com.grupo7.bolao.dto.response.UsuarioResponse;
import com.grupo7.bolao.enums.PerfilUsuario;
import com.grupo7.bolao.enums.StatusUsuario;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

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

    public Page<UsuarioResponse> listarUsuarios(String busca, Pageable pageable) {
        Page<Usuario> pageUsuarios;
        if (busca != null && !busca.trim().isEmpty()) {
            pageUsuarios = usuarioRepository.findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    busca, busca, pageable
            );
        } else {
            pageUsuarios = usuarioRepository.findAll(pageable);
        }
        return pageUsuarios.map(this::toResponse);
    }

    public UsuarioResponse obterDetalhesUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));
        return toResponse(usuario);
    }

    public UsuarioResponse alterarStatusUsuario(Long id, StatusUsuario status) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado"));
        usuario.setStatus(status);
        return toResponse(usuarioRepository.save(usuario));
    }

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
