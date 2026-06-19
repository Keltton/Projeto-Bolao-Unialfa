package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.request.SelecaoRequest;
import com.grupo7.bolao.dto.response.SelecaoResponse;
import com.grupo7.bolao.service.SelecaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * API REST Controller para administração de Seleções.
 * Contém endpoints restritos para criação, atualização e remoção de seleções no banco de dados.
 */
@RestController
@RequestMapping("/api/admin/selecoes")
public class AdminSelecaoApiController {

    private final SelecaoService selecaoService;

    /**
     * Construtor do AdminSelecaoApiController com injeção de dependências.
     *
     * @param selecaoService Serviço de seleções.
     */
    public AdminSelecaoApiController(SelecaoService selecaoService) {
        this.selecaoService = selecaoService;
    }

    /**
     * Endpoint POST para cadastrar uma nova seleção.
     *
     * @param request DTO com as informações da seleção a ser cadastrada.
     * @return ResponseEntity contendo a seleção criada com o status HTTP 201 Created.
     */
    @PostMapping
    public ResponseEntity<SelecaoResponse> cadastrar(@Valid @RequestBody SelecaoRequest request) {
        SelecaoResponse selecao = selecaoService.cadastrarSelecao(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(selecao);
    }

    /**
     * Endpoint PUT para atualizar uma seleção existente pelo seu ID.
     *
     * @param id ID da seleção a ser atualizada.
     * @param request DTO com as novas informações da seleção.
     * @return ResponseEntity contendo a seleção atualizada com o status HTTP 200 OK.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SelecaoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody SelecaoRequest request) {
        SelecaoResponse selecao = selecaoService.atualizarSelecao(id, request);
        return ResponseEntity.ok(selecao);
    }

    /**
     * Endpoint DELETE para remover uma seleção pelo seu ID.
     *
     * @param id ID da seleção a ser excluída.
     * @return ResponseEntity vazio com o status HTTP 244 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        selecaoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}
