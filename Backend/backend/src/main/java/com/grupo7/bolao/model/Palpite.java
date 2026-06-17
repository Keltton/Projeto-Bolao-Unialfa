package com.grupo7.bolao.model;

import com.grupo7.bolao.enums.CriterioPontuacao;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "palpites",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_usuario_partida",
                        columnNames = {"usuario_id", "partida_id"}
                )
        }
)
public class Palpite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "partida_id", nullable = false)
    private Partida partida;

    @Column(nullable = false)
    private Integer golsSelecaoA;

    @Column(nullable = false)
    private Integer golsSelecaoB;

    @Column(nullable = false)
    private Integer pontos = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CriterioPontuacao criterioPontuacao = CriterioPontuacao.PENDENTE;

    @Column(nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    private LocalDateTime atualizadoEm = LocalDateTime.now();

    public Palpite() {}

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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Partida getPartida() {
        return partida;
    }

    public void setPartida(Partida partida) {
        this.partida = partida;
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

    public Integer getPontos() {
        return pontos;
    }

    public void setPontos(Integer pontos) {
        this.pontos = pontos;
    }

    public CriterioPontuacao getCriterioPontuacao() {
        return criterioPontuacao;
    }

    public void setCriterioPontuacao(CriterioPontuacao criterioPontuacao) {
        this.criterioPontuacao = criterioPontuacao;
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
