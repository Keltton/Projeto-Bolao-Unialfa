package com.grupo7.bolao.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

//entidade do token pra recuperação, é aqui que fica definido os atributos da tabela e os construtores utilizado pelo backend
@Entity

//define as caracteristicas da tabela
@Table(name = "tokens_recuperacao_senha")
public class CodigoRecuperacaoSenha {

    //atributos e suas anotações
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 255)
    private String codigoHash;

    @Column(nullable = false)
    private LocalDateTime expiraEm;

    private LocalDateTime usadoEm;

    @Column(nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    public CodigoRecuperacaoSenha() {}


    //construtores dos atributos

    //executa antes da entidade ser inserida na banco, pega a data e hora do momento e registra nos atributos
    @PrePersist
    public void aoCriar() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }

    //get e setters
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

    public String getCodigoHash() {
        return codigoHash;
    }

    public void setCodigoHash(String codigoHash) {
        this.codigoHash = codigoHash;
    }

    public LocalDateTime getExpiraEm() {
        return expiraEm;
    }

    public void setExpiraEm(LocalDateTime expiraEm) {
        this.expiraEm = expiraEm;
    }

    public LocalDateTime getUsadoEm() {
        return usadoEm;
    }

    public void setUsadoEm(LocalDateTime usadoEm) {
        this.usadoEm = usadoEm;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
