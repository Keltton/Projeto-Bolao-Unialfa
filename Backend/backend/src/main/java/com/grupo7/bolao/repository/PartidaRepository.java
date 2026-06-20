package com.grupo7.bolao.repository;

import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;
import com.grupo7.bolao.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Interface de repositório para acesso aos dados da entidade {@link Partida} no banco de dados.
 * Herda operações CRUD do {@link JpaRepository}.
 */
public interface PartidaRepository extends JpaRepository<Partida, Long> {

    long countByStatus(StatusPartida status);

    /**
     * Busca partidas que ocorrem em uma determinada fase da competição.
     *
     * @param fase A fase desejada (ex: GRUPOS, OITAVAS).
     * @return Lista de partidas da fase informada.
     */
    List<Partida> findByFase(FasePartida fase);

    /**
     * Busca partidas com base no seu status atual.
     *
     * @param status O status do jogo (ex: AGENDADA, ANDAMENTO, ENCERRADA).
     * @return Lista de partidas correspondentes.
     */
    List<Partida> findByStatus(StatusPartida status);

    /**
     * Busca partidas combinando filtros de fase e status.
     *
     * @param fase A fase da competição.
     * @param status O status atual do jogo.
     * @return Lista de partidas filtradas.
     */
    List<Partida> findByFaseAndStatus(FasePartida fase, StatusPartida status);

    /**
     * Busca partidas que ocorrem dentro de um intervalo específico de data e hora.
     *
     * @param inicio Data e hora de início do intervalo.
     * @param fim Data e hora de fim do intervalo.
     * @return Lista de partidas ocorrendo no período.
     */
    List<Partida> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);

    /**
     * Lista todas as partidas que acontecem após uma determinada data/hora, ordenadas de forma cronológica ascendente.
     *
     * @param dataHora Ponto de partida cronológico.
     * @return Lista de partidas futuras ordenadas.
     */
    List<Partida> findByDataHoraAfterOrderByDataHoraAsc(LocalDateTime dataHora);


    /**
     * Busca partidas que ocorrem com uma seleção específica.
     *
     * @param selecaoAId ID da seleção A.
     * @param selecaoBId ID da seleção B.
     * @return Lista de partidas com a seleção.
     */
    List<Partida> findBySelecaoAIdOrSelecaoBId(Long selecaoAId, Long selecaoBId);
}
