package com.grupo7.bolao.repository;

import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;
import com.grupo7.bolao.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PartidaRepository extends JpaRepository<Partida, Long> {
    List<Partida> findByFase(FasePartida fase);
    List<Partida> findByStatus(StatusPartida status);
    List<Partida> findByFaseAndStatus(FasePartida fase, StatusPartida status);
    List<Partida> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);
    List<Partida> findByDataHoraAfterOrderByDataHoraAsc(LocalDateTime dataHora);
}
