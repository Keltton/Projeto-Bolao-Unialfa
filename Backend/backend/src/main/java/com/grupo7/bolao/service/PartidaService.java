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
import com.grupo7.bolao.repository.PalpiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

/**
 * Serviço responsável pelas regras de negócio associadas às Partidas.
 * Oferece métodos para cadastro, atualização, listagem, filtros cronológicos e de fase,
 * exclusão e lançamento de resultados com recálculo assíncrono ou síncrono em lote de palpites.
 */
@Service
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final SelecaoService selecaoService;
    private final PalpiteService palpiteService;
    private final PalpiteRepository palpiteRepository;

    /**
     * Construtor da classe PartidaService com injeção de dependências.
     */
    public PartidaService(
            PartidaRepository partidaRepository,
            SelecaoService selecaoService,
            PalpiteService palpiteService,
            PalpiteRepository palpiteRepository
    ) {
        this.partidaRepository = partidaRepository;
        this.selecaoService = selecaoService;
        this.palpiteService = palpiteService;
        this.palpiteRepository = palpiteRepository;
    }

    /**
     * Cadastra uma nova partida, validando seleções, horário, status e duplicidade.
     *
     * @param request DTO com as informações da partida.
     * @return DTO com as informações da partida criada.
     * @throws IllegalArgumentException Se as validações de negócio falharem.
     */
    public PartidaResponse cadastrarPartida(PartidaRequest request) {
        validarSelecoesDiferentes(request.selecaoAId(), request.selecaoBId());
        validarDataEStatus(request);
        validarConflitoHorarioCadastro(request);

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

    /**
     * Retorna todas as partidas ordenadas cronologicamente.
     *
     * @return Lista de partidas no formato de DTO {@link PartidaResponse}.
     */
    public List<PartidaResponse> listarTodasPartidas() {
        return ordenarPorData(partidaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList());
    }

    /**
     * Busca uma partida por ID e retorna no formato de DTO.
     *
     * @param id Identificador da partida.
     * @return DTO da partida.
     */
    public PartidaResponse buscarPartidaPorId(Long id) {
        return toResponse(buscarEntidadePorId(id));
    }

    /**
     * Busca a entidade {@link Partida} diretamente por ID.
     *
     * @param id Identificador da partida.
     * @return Entidade {@link Partida} localizada.
     * @throws IllegalArgumentException Se a partida não for localizada.
     */
    public Partida buscarEntidadePorId(Long id) {
        return partidaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Partida nao encontrada."));
    }

    /**
     * Filtra partidas por fase.
     *
     * @param fase Fase do torneio.
     * @return Lista de partidas da fase informada.
     */
    public List<PartidaResponse> listarPorFase(FasePartida fase) {
        return ordenarPorData(partidaRepository.findByFase(fase)
                .stream()
                .map(this::toResponse)
                .toList());
    }

    /**
     * Filtra partidas por status.
     *
     * @param status Status da partida.
     * @return Lista de partidas que possuem o status informado.
     */
    public List<PartidaResponse> listarPorStatus(StatusPartida status) {
        return ordenarPorData(partidaRepository.findByStatus(status)
                .stream()
                .map(this::toResponse)
                .toList());
    }

    /**
     * Filtra partidas combinando fase e status.
     *
     * @param fase Fase da competição.
     * @param status Status atual do jogo.
     * @return Lista de partidas correspondentes.
     */
    public List<PartidaResponse> listarPorFaseEStatus(FasePartida fase, StatusPartida status) {
        return ordenarPorData(partidaRepository.findByFaseAndStatus(fase, status)
                .stream()
                .map(this::toResponse)
                .toList());
    }

    /**
     * Filtra partidas dentro de um intervalo específico de tempo.
     *
     * @param inicio Data/hora inicial.
     * @param fim Data/hora final.
     * @return Lista de partidas no período.
     */
    public List<PartidaResponse> listarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return partidaRepository.findByDataHoraBetween(inicio, fim)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Lista as partidas futuras com relação ao momento atual.
     *
     * @return Lista de próximas partidas cronologicamente ordenadas.
     */
    public List<PartidaResponse> listarProximasPartidas() {
        return partidaRepository.findByDataHoraAfterOrderByDataHoraAsc(LocalDateTime.now())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Atualiza dados cadastrais de uma partida existente.
     *
     * @param id ID da partida.
     * @param request DTO com as alterações desejadas.
     * @return DTO com os dados da partida atualizada.
     * @throws IllegalArgumentException Se as validações de negócio falharem.
     */
    public PartidaResponse atualizarPartida(Long id, PartidaRequest request) {
        validarSelecoesDiferentes(request.selecaoAId(), request.selecaoBId());
        validarDataEStatus(request);
        validarConflitoHorarioAtualizacao(id, request);

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

    /**
     * Registra o placar oficial de uma partida e altera seu status para ENCERRADA.
     * Dispara automaticamente em lote o recálculo dos palpites dos usuários associados a este jogo.
     *
     * @param id ID da partida.
     * @param request DTO contendo o número de gols marcados pelas seleções.
     * @return DTO com os dados da partida atualizada e finalizada.
     */
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

    /**
     * Remove uma partida caso esta não possua palpites registrados pelos usuários do bolão.
     *
     * @param id ID da partida.
     * @throws IllegalArgumentException Se houver palpites atrelados à partida.
     */
    public void remover(Long id) {
        Partida partida = buscarEntidadePorId(id);
        if (palpiteRepository.existsByPartidaId(id)) {
            throw new IllegalArgumentException("Nao e possivel excluir partida com palpites registrados.");
        }
        partidaRepository.delete(partida);
    }

    /**
     * Auxiliar para ordenar cronologicamente a lista de respostas.
     */
    private List<PartidaResponse> ordenarPorData(List<PartidaResponse> partidas) {
        return partidas.stream()
                .sorted(Comparator.comparing(PartidaResponse::dataHora))
                .toList();
    }

    /**
     * Filtra partidas em que a seleção participa (como A ou B).
     */
    public List<PartidaResponse> listarPorSelecao(Long selecaoId) {
        return ordenarPorData(
                partidaRepository.findBySelecaoAIdOrSelecaoBId(selecaoId, selecaoId)
                        .stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    /**
     * Garante que não sejam selecionadas as mesmas seleções no mesmo confronto.
     */
    private void validarSelecoesDiferentes(Long selecaoAId, Long selecaoBId) {
        if (selecaoAId.equals(selecaoBId)) {
            throw new IllegalArgumentException("A partida deve ter duas selecoes diferentes.");
        }
    }

    /**
     * Valida a combinação de data/hora e status da partida.
     */
    private void validarDataEStatus(PartidaRequest request) {
        StatusPartida status = request.status() != null ? request.status() : StatusPartida.AGENDADA;
        LocalDateTime agora = LocalDateTime.now();

        if (request.dataHora().isBefore(agora)) {
            if (status != StatusPartida.ENCERRADA && status != StatusPartida.EM_ANDAMENTO) {
                throw new IllegalArgumentException(
                        "Partidas no passado devem ser cadastradas com status Em andamento ou Encerrada."
                );
            }
            return;
        }

        if (request.dataHora().isAfter(agora)
                && (status == StatusPartida.ENCERRADA || status == StatusPartida.EM_ANDAMENTO)) {
            throw new IllegalArgumentException("Partidas futuras devem ser cadastradas com status Agendada.");
        }
    }

    /**
     * Impede cadastro duplicado do mesmo confronto no mesmo horário.
     */
    private void validarConflitoHorarioCadastro(PartidaRequest request) {
        if (partidaRepository.existsMesmoConfrontoNoHorario(
                request.selecaoAId(),
                request.selecaoBId(),
                request.dataHora())) {
            throw new IllegalArgumentException("Ja existe uma partida entre estas selecoes neste horario.");
        }

        if (partidaRepository.existsConflitoHorario(
                request.selecaoAId(),
                request.selecaoBId(),
                request.dataHora())) {
            throw new IllegalArgumentException("Uma das selecoes ja possui outra partida neste horario.");
        }
    }

    /**
     * Impede atualização que gere confronto duplicado ou conflito de horário.
     */
    private void validarConflitoHorarioAtualizacao(Long partidaId, PartidaRequest request) {
        if (partidaRepository.existsMesmoConfrontoNoHorarioIgnorandoPartida(
                partidaId,
                request.selecaoAId(),
                request.selecaoBId(),
                request.dataHora())) {
            throw new IllegalArgumentException("Ja existe uma partida entre estas selecoes neste horario.");
        }

        if (partidaRepository.existsConflitoHorarioIgnorandoPartida(
                partidaId,
                request.selecaoAId(),
                request.selecaoBId(),
                request.dataHora())) {
            throw new IllegalArgumentException("Uma das selecoes ja possui outra partida neste horario.");
        }
    }

    /**
     * Converte a entidade Partida para o DTO correspondente.
     */
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

    /**
     * Converte entidade Seleção para DTO.
     */
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
