package com.grupo7.bolao.model;

import com.grupo7.bolao.enums.FasePartida;
import com.grupo7.bolao.enums.StatusPartida;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidade que representa uma Partida de futebol da Copa do Mundo de 2026.
 * Mapeia a tabela "partidas" no banco de dados MySQL e armazena os IDs das duas seleções envolvidas,
 * a data/hora do jogo, o estádio, a fase do torneio, o status atual (ex: AGENDADA, ANDAMENTO, ENCERRADA)
 * e o placar oficial de gols de cada equipe.
 */
@Entity
@Table(name = "partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "selecao_a_id", nullable = false)
    private Selecao selecaoA;

    @ManyToOne(optional = false)
    @JoinColumn(name = "selecao_b_id", nullable = false)
    private Selecao selecaoB;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(length = 150)
    private String estadio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FasePartida fase;

    @Column(length = 10)
    private String grupo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPartida status = StatusPartida.AGENDADA;

    private Integer golsSelecaoA;

    private Integer golsSelecaoB;

    @Column(nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    private LocalDateTime atualizadoEm = LocalDateTime.now();

    public Partida() {}

    @PrePersist
    public void aoCriar() {
        LocalDateTime agora = LocalDateTime.now();

        if (criadoEm == null) {
            criadoEm = agora;
        }

        if (atualizadoEm == null) {
            atualizadoEm = agora;
        }
    }

    @PreUpdate
    public void aoAtualizar() {
        atualizadoEm = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Selecao getSelecaoA() {
        return selecaoA;
    }

    public void setSelecaoA(Selecao selecaoA) {
        this.selecaoA = selecaoA;
    }

    public Selecao getSelecaoB() {
        return selecaoB;
    }

    public void setSelecaoB(Selecao selecaoB) {
        this.selecaoB = selecaoB;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getEstadio() {
        return estadio;
    }

    public void setEstadio(String estadio) {
        this.estadio = estadio;
    }

    public FasePartida getFase() {
        return fase;
    }

    public void setFase(FasePartida fase) {
        this.fase = fase;
    }

    public String getGrupo() {
        return grupo;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public StatusPartida getStatus() {
        return status;
    }

    public void setStatus(StatusPartida status) {
        this.status = status;
    }

    public Integer getGolsSelecaoA() {
        return golsSelecaoA;
    }

    public void setGolsSelecaoA(Integer golsSelecaoA) {
        this.golsSelecaoA = golsSelecaoA;
    }

    public Integer getGolsSelecaoB() {
        return golsSelecaoB;
    }

    public void setGolsSelecaoB(Integer golsSelecaoB) {
        this.golsSelecaoB = golsSelecaoB;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

}
