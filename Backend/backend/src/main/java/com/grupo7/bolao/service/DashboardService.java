package com.grupo7.bolao.service;

import com.grupo7.bolao.dto.response.DashboardResumoResponse;
import com.grupo7.bolao.enums.StatusPartida;
import com.grupo7.bolao.enums.StatusUsuario;
import com.grupo7.bolao.repository.PalpiteRepository;
import com.grupo7.bolao.repository.PartidaRepository;
import com.grupo7.bolao.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DashboardService {

    private static final int HORAS_PARA_USUARIO_ATIVO = 24;

    private final UsuarioRepository usuarioRepository;
    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;

    public DashboardService(
            UsuarioRepository usuarioRepository,
            PalpiteRepository palpiteRepository,
            PartidaRepository partidaRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.palpiteRepository = palpiteRepository;
        this.partidaRepository = partidaRepository;
    }

    public DashboardResumoResponse obterResumo() {
        LocalDateTime limiteAtividade = LocalDateTime.now().minusHours(HORAS_PARA_USUARIO_ATIVO);

        return new DashboardResumoResponse(
                usuarioRepository.count(),
                palpiteRepository.count(),
                partidaRepository.countByStatus(StatusPartida.AGENDADA),
                usuarioRepository.countByStatus(StatusUsuario.ATIVO),
                usuarioRepository.countByUltimoLoginEmAfter(limiteAtividade)
        );
    }
}
