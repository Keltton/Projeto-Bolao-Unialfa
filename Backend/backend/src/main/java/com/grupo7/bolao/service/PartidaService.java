package com.grupo7.bolao.service;

import com.grupo7.bolao.dto.request.PartidaRequest;
import com.grupo7.bolao.dto.request.ResultadoPartidaRequest;
import com.grupo7.bolao.dto.response.PartidaResponse;
import com.grupo7.bolao.dto.response.SelecaoResponse;
import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;
import com.grupo7.bolao.model.Partida;
import com.grupo7.bolao.model.Selecao;
import com.grupo7.bolao.repository.PartidaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final SelecaoService selecaoService;
    private final PalpiteService palpiteService;

    public PartidaService(
            PartidaRepository partidaRepository,
            SelecaoService selecaoService,
            PalpiteService palpiteService
    ) {
        this.partidaRepository = partidaRepository;
        this.selecaoService = selecaoService;
        this.palpiteService = palpiteService;
    }

    public PartidaResponse cadastrarPartida(PartidaRequest request) {
        validarSelecoesDiferentes(request.selecaoAId(), request.selecaoBId());

        Selecao selecaoA = selecaoService.buscarEntidadePorId(request.selecaoAId());
        Selecao selecaoB = selecaoService.buscarEntidadePorId(request.selecaoBId());

        Partida partida = new Partida();
        partida.setSelecaoA(selecaoA);
        partida.setSelecaoB(selecaoB);
        partida.setDataHora(request.dataHora());
        partida.setEstadio(request.estadio());
        partida.setFase(request.fase());
        partida.setGrupo(request.grupo());
        partida.setStatus(request.status() != null ? request.status() : StatusPartida.AGENDADA);

        return toResponse(partidaRepository.save(partida));
    }

    public List<PartidaResponse> listarTodasPartidas() {
        return partidaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PartidaResponse buscarPartidaPorId(Long id) {
        return toResponse(buscarEntidadePorId(id));
    }

    public Partida buscarEntidadePorId(Long id) {
        return partidaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partida nao encontrada."));
    }

    public List<PartidaResponse> listarPorFase(FasePartida fase) {
        return partidaRepository.findByFase(fase)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PartidaResponse> listarPorStatus(StatusPartida status) {
        return partidaRepository.findByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PartidaResponse> listarPorFaseEStatus(FasePartida fase, StatusPartida status) {
        return partidaRepository.findByFaseAndStatus(fase, status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PartidaResponse> listarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return partidaRepository.findByDataHoraBetween(inicio, fim)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PartidaResponse> listarProximasPartidas() {
        return partidaRepository.findByDataHoraAfterOrderByDataHoraAsc(LocalDateTime.now())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PartidaResponse atualizarPartida(Long id, PartidaRequest request) {
        validarSelecoesDiferentes(request.selecaoAId(), request.selecaoBId());

        Partida partida = buscarEntidadePorId(id);
        Selecao selecaoA = selecaoService.buscarEntidadePorId(request.selecaoAId());
        Selecao selecaoB = selecaoService.buscarEntidadePorId(request.selecaoBId());

        partida.setSelecaoA(selecaoA);
        partida.setSelecaoB(selecaoB);
        partida.setDataHora(request.dataHora());
        partida.setEstadio(request.estadio());
        partida.setFase(request.fase());
        partida.setGrupo(request.grupo());

        if (request.status() != null) {
            partida.setStatus(request.status());
        }

        return toResponse(partidaRepository.save(partida));
    }

    @Transactional
    public PartidaResponse lancarResultado(Long id, ResultadoPartidaRequest request) {
        Partida partida = buscarEntidadePorId(id);

        partida.setGolsSelecaoA(request.golsSelecaoA());
        partida.setGolsSelecaoB(request.golsSelecaoB());
        partida.setStatus(StatusPartida.ENCERRADA);

        Partida partidaSalva = partidaRepository.save(partida);
        palpiteService.recalcularPontuacaoDaPartida(partidaSalva.getId());

        return toResponse(partidaSalva);
    }

    public void remover(Long id) {
        Partida partida = buscarEntidadePorId(id);
        partidaRepository.delete(partida);
    }

    private void validarSelecoesDiferentes(Long selecaoAId, Long selecaoBId) {
        if (selecaoAId.equals(selecaoBId)) {
            throw new IllegalArgumentException("A partida deve ter duas selecoes diferentes.");
        }
    }

    private PartidaResponse toResponse(Partida partida) {
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
