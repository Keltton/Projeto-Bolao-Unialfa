package com.grupo7.bolao.repository;

import com.grupo7.bolao.model.Selecao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Interface de repositório para acesso aos dados da entidade {@link Selecao} no banco de dados.
 * Estende {@link JpaRepository} para fornecer operações CRUD padrão.
 */
public interface SelecaoRepository extends JpaRepository<Selecao, Long> {

    /**
     * Busca uma seleção pelo seu código FIFA oficial.
     *
     * @param codigoFifa O código de 3 letras da seleção.
     * @return Um {@link Optional} contendo a seleção se encontrada, ou vazio caso contrário.
     */
    Optional<Selecao> findByCodigoFifa(String codigoFifa);

    /**
     * Verifica se já existe uma seleção cadastrada com o código FIFA informado.
     *
     * @param codigoFifa O código de 3 letras a ser verificado.
     * @return true se o código já estiver cadastrado, false caso contrário.
     */
    boolean existsByCodigoFifa(String codigoFifa);
    boolean existsByNomeIgnoreCase(String nome);
    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);

    /**
     * Lista todas as seleções que pertencem a um determinado grupo na primeira fase.
     *
     * @param grupo O caractere ou código do grupo (ex: "A", "B").
     * @return Uma lista de seleções pertencentes ao grupo.
     */
    List<Selecao> findByGrupo(String grupo);

    /**
     * Busca seleções pelo nome (ou parte dele), ignorando diferenças entre maiúsculas e minúsculas.
     * Utiliza JPQL customizada para melhor legibilidade do código.
     *
     * @param nome O termo de busca para o nome da seleção.
     * @return Uma lista de seleções que contêm o termo buscado no nome.
     */
    @Query("SELECT s FROM Selecao s WHERE LOWER(s.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Selecao> buscarPorNome(@Param("nome") String nome);

    /**
     * Busca seleções pelo nome e que pertençam a um grupo específico na primeira fase.
     * Utiliza JPQL customizada para melhor legibilidade do código.
     *
     * @param nome O termo de busca para o nome da seleção.
     * @param grupo O grupo específico.
     * @return Uma lista de seleções filtradas por nome e grupo.
     */
    @Query("SELECT s FROM Selecao s WHERE LOWER(s.nome) LIKE LOWER(CONCAT('%', :nome, '%')) AND s.grupo = :grupo")
    List<Selecao> buscarPorNomeEGrupo(@Param("nome") String nome, @Param("grupo") String grupo);
}
