package com.grupo7.bolao.service;

import com.grupo7.bolao.dto.request.PalpiteRequest;
import com.grupo7.bolao.dto.response.PalpiteResponse;
import com.grupo7.bolao.dto.response.PartidaResponse;
import com.grupo7.bolao.dto.response.SelecaoResponse;
import com.grupo7.bolao.dto.response.UsuarioResponse;
import com.grupo7.bolao.enums.CriterioPontuacao;
import com.grupo7.bolao.enums.StatusPartida;
import com.grupo7.bolao.model.Palpite;
import com.grupo7.bolao.model.Partida;
import com.grupo7.bolao.model.Selecao;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.repository.PalpiteRepository;
import com.grupo7.bolao.repository.PartidaRepository;
import com.grupo7.bolao.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PalpiteService {

    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;
    private final UsuarioRepository usuarioRepository;

    public PalpiteService(
            PalpiteRepository palpiteRepository,
            PartidaRepository partidaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.palpiteRepository = palpiteRepository;
        this.partidaRepository = partidaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PalpiteResponse registrarPalpite(Usuario usuario, PalpiteRequest request) {
        Partida partida = buscarPartidaPorId(request.partidaId());

        validarPartidaAbertaParaPalpite(partida);

        if (palpiteRepository.existsByUsuarioIdAndPartidaId(usuario.getId(), partida.getId())) {
            throw new IllegalArgumentException("Usuario ja possui palpite para esta partida.");
        }

        Palpite palpite = new Palpite();
        palpite.setUsuario(usuario);
        palpite.setPartida(partida);
        palpite.setGolsSelecaoA(request.golsSelecaoA());
        palpite.setGolsSelecaoB(request.golsSelecaoB());
        palpite.setPontos(0);
        palpite.setCriterioPontuacao(CriterioPontuacao.PENDENTE);

        return toResponse(palpiteRepository.save(palpite));
    }

    public List<PalpiteResponse> listarMeusPalpites(Usuario usuario) {
        return palpiteRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PalpiteResponse buscarMeuPalpitePorId(Long id, Usuario usuario) {
        Palpite palpite = buscarPalpiteDoUsuario(id, usuario.getId());
        return toResponse(palpite);
    }

    @Transactional
    public PalpiteResponse editarPalpite(Long id, Usuario usuario, PalpiteRequest request) {
        Palpite palpite = buscarPalpiteDoUsuario(id, usuario.getId());

        if (!palpite.getPartida().getId().equals(request.partidaId())) {
            throw new IllegalArgumentException("Nao e possivel alterar a partida do palpite.");
        }

        validarPartidaAbertaParaPalpite(palpite.getPartida());

        palpite.setGolsSelecaoA(request.golsSelecaoA());
        palpite.setGolsSelecaoB(request.golsSelecaoB());

        return toResponse(palpiteRepository.save(palpite));
    }

    @Transactional
    public void removerPalpite(Long id, Usuario usuario) {
        Palpite palpite = buscarPalpiteDoUsuario(id, usuario.getId());

        validarPartidaAbertaParaPalpite(palpite.getPartida());

        palpiteRepository.delete(palpite);
    }

    @Transactional
    public void recalcularPontuacaoDaPartida(Long partidaId) {
        Partida partida = buscarPartidaPorId(partidaId);

        if (partida.getStatus() != StatusPartida.ENCERRADA
                || partida.getGolsSelecaoA() == null
                || partida.getGolsSelecaoB() == null) {
            throw new IllegalArgumentException("A partida precisa estar encerrada e com resultado preenchido.");
        }

        List<Palpite> palpites = palpiteRepository.findByPartidaId(partidaId);
        Set<Usuario> usuariosAfetados = new HashSet<>();

        for (Palpite palpite : palpites) {
            aplicarPontuacao(palpite, partida);
            usuariosAfetados.add(palpite.getUsuario());
        }

        palpiteRepository.saveAll(palpites);

        for (Usuario usuario : usuariosAfetados) {
            atualizarPontuacaoUsuario(usuario);
        }
    }

    private Palpite buscarPalpiteDoUsuario(Long id, Long usuarioId) {
        return palpiteRepository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Palpite nao encontrado."));
    }

    private Partida buscarPartidaPorId(Long id) {
        return partidaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partida nao encontrada."));
    }

    private void validarPartidaAbertaParaPalpite(Partida partida) {
        if (!LocalDateTime.now().isBefore(partida.getDataHora())) {
            throw new IllegalArgumentException("Nao e possivel palpitar apos o inicio da partida.");
        }
    }

    private void aplicarPontuacao(Palpite palpite, Partida partida) {
        int placarPalpiteA = palpite.getGolsSelecaoA();
        int placarPalpiteB = palpite.getGolsSelecaoB();
        int placarRealA = partida.getGolsSelecaoA();
        int placarRealB = partida.getGolsSelecaoB();

        if (placarPalpiteA == placarRealA && placarPalpiteB == placarRealB) {
            palpite.setPontos(10);
            palpite.setCriterioPontuacao(CriterioPontuacao.PLACAR_EXATO);
            return;
        }

        if (Integer.compare(placarPalpiteA, placarPalpiteB) == Integer.compare(placarRealA, placarRealB)) {
            palpite.setPontos(5);
            palpite.setCriterioPontuacao(CriterioPontuacao.VENCEDOR_EMPATE);
            return;
        }

        palpite.setPontos(0);
        palpite.setCriterioPontuacao(CriterioPontuacao.ERROU);
    }

    private void atualizarPontuacaoUsuario(Usuario usuario) {
        List<Palpite> palpites = palpiteRepository.findByUsuarioId(usuario.getId());

        int pontuacaoTotal = palpites.stream()
                .mapToInt(Palpite::getPontos)
                .sum();

        int placaresExatos = (int) palpites.stream()
                .filter(palpite -> palpite.getCriterioPontuacao() == CriterioPontuacao.PLACAR_EXATO)
                .count();

        usuario.setPontuacaoTotal(pontuacaoTotal);
        usuario.setPlacaresExatos(placaresExatos);

        usuarioRepository.save(usuario);
    }

    private PalpiteResponse toResponse(Palpite palpite) {
        return new PalpiteResponse(
                palpite.getId(),
                toUsuarioResponse(palpite.getUsuario()),
                toPartidaResponse(palpite.getPartida()),
                palpite.getGolsSelecaoA(),
                palpite.getGolsSelecaoB(),
                palpite.getPontos(),
                palpite.getCriterioPontuacao(),
                palpite.getCriadoEm(),
                palpite.getAtualizadoEm()
        );
    }

    private UsuarioResponse toUsuarioResponse(Usuario usuario) {
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

    private PartidaResponse toPartidaResponse(Partida partida) {
        return new PartidaResponse(
                partida.getId(),
                toSelecaoResponse(partida.getSelecaoA()),
                toSelecaoResponse(partida.getSelecaoB()),
                partida.getDataHora(),
                partida.getEstadio(),
                partida.getFase(),
                partida.getGrupo(),
                partida.getStatus(),
                partida.getGolsSelecaoA(),
                partida.getGolsSelecaoB(),
                partida.getCriadoEm(),
                partida.getAtualizadoEm()
        );
    }

    private SelecaoResponse toSelecaoResponse(Selecao selecao) {
        return new SelecaoResponse(
                selecao.getId(),
                selecao.getNome(),
                selecao.getCodigoFifa(),
                selecao.getBandeiraUrl(),
                selecao.getGrupo(),
                selecao.getCriadoEm(),
                selecao.getAtualizadoEm()
        );
    }
}
