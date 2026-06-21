package com.grupo7.bolao.service;

import com.grupo7.bolao.dto.request.SelecaoRequest;
import com.grupo7.bolao.dto.response.SelecaoResponse;
import com.grupo7.bolao.model.Selecao;
import com.grupo7.bolao.repository.PartidaRepository;
import com.grupo7.bolao.repository.SelecaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço responsável por encapsular as regras de negócio e persistência associadas às Seleções.
 * Realiza validações de unicidade de nome/código FIFA, normalização de dados e listagem com filtros.
 */
@Service
public class SelecaoService {
    private final SelecaoRepository selecaoRepository;
    private final PartidaRepository partidaRepository;

    /**
     * Construtor da classe SelecaoService com injeção de dependências.
     *
     * @param selecaoRepository Repositório de seleções.
     */
    public SelecaoService(SelecaoRepository selecaoRepository, PartidaRepository partidaRepository) {
        this.selecaoRepository = selecaoRepository;
        this.partidaRepository = partidaRepository;
    }

    /**
     * Cadastra uma nova seleção no banco de dados após normalizar e validar a unicidade do nome e código FIFA.
     *
     * @param request DTO contendo os dados da seleção a ser cadastrada.
     * @return DTO contendo os dados da seleção criada.
     * @throws IllegalArgumentException Se o código FIFA já estiver em uso.
     */
    public SelecaoResponse cadastrarSelecao(SelecaoRequest request) {
        String nome = normalizarNome(request.nome());
        String codigoFifa = normalizarCodigoFifa(request.codigoFifa());

        if (selecaoRepository.existsByNomeIgnoreCase(nome)) {
            throw new IllegalArgumentException("Ja existe uma selecao com esse nome");
        }

        if (selecaoRepository.existsByCodigoFifa(codigoFifa)) {
            throw new IllegalArgumentException("Ja existe uma selecao com esse codigo FIFA");
        }

        Selecao selecao = new Selecao();
        selecao.setNome(nome);
        selecao.setCodigoFifa(codigoFifa);
        selecao.setBandeiraUrl(request.bandeiraUrl());
        selecao.setGrupo(request.grupo());

        return toResponse(selecaoRepository.save(selecao));
    }

    /**
     * Retorna todas as seleções cadastradas.
     *
     * @return Lista com todas as seleções no formato de DTO {@link SelecaoResponse}.
     */
    public List<SelecaoResponse> listarTodasSelecoes() {
        return selecaoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Busca uma seleção pelo seu ID e retorna a resposta formatada como DTO.
     *
     * @param id Identificador da seleção.
     * @return DTO com os dados da seleção encontrada.
     * @throws IllegalArgumentException Se a seleção não for encontrada.
     */
    public SelecaoResponse buscarSelecaoPorId(Long id) {
        return toResponse(buscarEntidadePorId(id));
    }

    /**
     * Busca e retorna a entidade {@link Selecao} diretamente a partir de seu ID.
     * Método de uso interno e para serviços relacionados.
     *
     * @param id Identificador da seleção.
     * @return A entidade {@link Selecao} encontrada.
     * @throws IllegalArgumentException Se a seleção não for encontrada.
     */
    public Selecao buscarEntidadePorId(Long id) {
        return selecaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Selecao nao encontrada."));
    }

    /**
     * Lista as seleções que pertencem a um grupo específico.
     *
     * @param grupo Nome/letra do grupo.
     * @return Lista de seleções pertencentes ao grupo no formato de DTO.
     */
    public List<SelecaoResponse> listarPorGrupo(String grupo) {
        return selecaoRepository.findByGrupo(grupo)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Lista e filtra as seleções com base em critérios de busca opcionais como nome e/ou grupo.
     * Normaliza as entradas antes de consultar o banco de dados.
     *
     * @param nome Nome parcial da seleção (opcional).
     * @return Lista de seleções que correspondem aos critérios.
     */
    public List<SelecaoResponse> listarSelecoes(String nome) {
        String nomeTrim = (nome != null) ? nome.trim() : "";

        boolean temNome = !nomeTrim.isEmpty();

        List<Selecao> selecoes;
        if (temNome) {
            selecoes = selecaoRepository.buscarPorNome(nomeTrim);
        } else {
            selecoes = selecaoRepository.findAll();
        }

        return selecoes.stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Obtém o número total de seleções cadastradas no banco de dados.
     *
     * @return Quantidade de registros na tabela de seleções.
     */
    public long obterTotalSelecoes() {
        return selecaoRepository.count();
    }

    /**
     * Atualiza os dados de uma seleção existente a partir do seu ID e de um DTO de dados.
     *
     * @param id Identificador da seleção a ser atualizada.
     * @param request DTO com as novas informações da seleção.
     * @return DTO com os dados da seleção atualizada.
     * @throws IllegalArgumentException Se a seleção não existir ou se o novo código FIFA já estiver sendo usado por outra seleção.
     */
    public SelecaoResponse atualizarSelecao(Long id, SelecaoRequest request) {
        Selecao selecao = buscarEntidadePorId(id);
        String nome = normalizarNome(request.nome());
        String codigoFifa = normalizarCodigoFifa(request.codigoFifa());

        if (selecaoRepository.existsByNomeIgnoreCaseAndIdNot(nome, id)) {
            throw new IllegalArgumentException("Ja existe uma selecao com esse nome");
        }

        if (!selecao.getCodigoFifa().equals(codigoFifa)
                && selecaoRepository.existsByCodigoFifa(codigoFifa)) {
            throw new IllegalArgumentException("Ja existe uma selecao com esse codigo FIFA");
        }

        selecao.setNome(nome);
        selecao.setCodigoFifa(codigoFifa);
        selecao.setBandeiraUrl(request.bandeiraUrl());
        selecao.setGrupo(request.grupo());

        return toResponse(selecaoRepository.save(selecao));
    }

    /**
     * Remove uma seleção cadastrada se esta for localizada pelo ID fornecido.
     *
     * @param id Identificador da seleção a ser excluída.
     * @throws IllegalArgumentException Se a seleção não for encontrada.
     */
    public void remover(Long id) {
        Selecao selecao = buscarEntidadePorId(id);

        if (partidaRepository.existsBySelecaoAIdOrSelecaoBId(id, id)) {
            throw new IllegalArgumentException("Nao e possivel excluir selecao vinculada a partidas cadastradas.");
        }

        selecaoRepository.delete(selecao);
    }

    /**
     * Auxiliar para normalizar o código FIFA para maiúsculas e sem espaços extras.
     */
    private String normalizarCodigoFifa(String codigoFifa) {
        return codigoFifa.trim().toUpperCase();
    }

    /**
     * Auxiliar para remover espaços extras do nome antes de validar e salvar.
     */
    private String normalizarNome(String nome) {
        return nome.trim();
    }

    /**
     * Converte uma entidade {@link Selecao} para o DTO correspondente {@link SelecaoResponse}.
     */
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
