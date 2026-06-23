package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.enums.StatusPartida;
import com.grupo7.bolao.dto.response.PartidaResponse;
import com.grupo7.bolao.service.PartidaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoApiController {

    private final PartidaService partidaService;

    public NotificacaoApiController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    @GetMapping
    public ResponseEntity<List<NotificacaoDto>> obterNotificacoes() {
        List<NotificacaoDto> notificacoes = new ArrayList<>();

        notificacoes.add(new NotificacaoDto(
                "welcome",
                "Bem-vindo ao Bolão! ⚽",
                "Faça seus palpites nas próximas partidas e dispute o topo do ranking geral.",
                "INFO",
                "Hoje"
        ));

        List<PartidaResponse> partidasEncerradas = partidaService.listarPorStatus(StatusPartida.ENCERRADA);
        
        int limite = Math.min(partidasEncerradas.size(), 4);
        for (int i = 0; i < limite; i++) {
            PartidaResponse p = partidasEncerradas.get(i);
            String placar = p.golsSelecaoA() + " x " + p.golsSelecaoB();
            notificacoes.add(new NotificacaoDto(
                    "match-" + p.id(),
                    "Partida Encerrada! 🏁",
                    p.selecaoA().nome() + " " + placar + " " + p.selecaoB().nome() + ". Verifique sua pontuação!",
                    "PARTIDA",
                    p.dataHora().format(DateTimeFormatter.ofPattern("dd/MM HH:mm"))
            ));
        }

        return ResponseEntity.ok(notificacoes);
    }
}

record NotificacaoDto(String id, String titulo, String mensagem, String tipo, String data) {}
