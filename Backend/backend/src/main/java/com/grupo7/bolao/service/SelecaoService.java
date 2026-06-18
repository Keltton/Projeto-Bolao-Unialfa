package com.grupo7.bolao.service;

import com.grupo7.bolao.dto.request.SelecaoRequest;
import com.grupo7.bolao.dto.response.SelecaoResponse;
import com.grupo7.bolao.model.Selecao;
import com.grupo7.bolao.repository.SelecaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SelecaoService {
    private final SelecaoRepository selecaoRepository;

    public SelecaoService(SelecaoRepository selecaoRepository) {
        this.selecaoRepository = selecaoRepository;
    }

    public SelecaoResponse cadastrarSelecao(SelecaoRequest request) {
        String codigoFifa = normalizarCodigoFifa(request.codigoFifa());

        if (selecaoRepository.existsByCodigoFifa(codigoFifa)) {
            throw new IllegalArgumentException("Ja existe uma selecao com esse codigo FIFA");
        }

        Selecao selecao = new Selecao();
        selecao.setNome(request.nome());
        selecao.setCodigoFifa(codigoFifa);
        selecao.setBandeiraUrl(request.bandeiraUrl());
        selecao.setGrupo(request.grupo());

        return toResponse(selecaoRepository.save(selecao));
    }

    public List<SelecaoResponse> listarTodasSelecoes() {
        return selecaoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SelecaoResponse buscarSelecaoPorId(Long id) {
        return toResponse(buscarEntidadePorId(id));
    }

    public Selecao buscarEntidadePorId(Long id) {
        return selecaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Selecao nao encontrada."));
    }

    public List<SelecaoResponse> listarPorGrupo(String grupo) {
        return selecaoRepository.findByGrupo(grupo)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SelecaoResponse atualizarSelecao(Long id, SelecaoRequest request) {
        Selecao selecao = buscarEntidadePorId(id);
        String codigoFifa = normalizarCodigoFifa(request.codigoFifa());

        if (!selecao.getCodigoFifa().equals(codigoFifa)
                && selecaoRepository.existsByCodigoFifa(codigoFifa)) {
            throw new IllegalArgumentException("Ja existe uma selecao com esse codigo FIFA");
        }

        selecao.setNome(request.nome());
        selecao.setCodigoFifa(codigoFifa);
        selecao.setBandeiraUrl(request.bandeiraUrl());
        selecao.setGrupo(request.grupo());

        return toResponse(selecaoRepository.save(selecao));
    }

    public void remover(Long id) {
        Selecao selecao = buscarEntidadePorId(id);
        selecaoRepository.delete(selecao);
    }

    private String normalizarCodigoFifa(String codigoFifa) {
        return codigoFifa.trim().toUpperCase();
    }

    private SelecaoResponse toResponse(Selecao selecao) {
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
