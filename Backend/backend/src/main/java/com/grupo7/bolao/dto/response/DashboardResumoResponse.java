package com.grupo7.bolao.dto.response;

public record DashboardResumoResponse(
        long totalUsuarios,
        long totalPalpites,
        long partidasPendentes,
        long usuariosAtivos,
        long usuariosAtivosUltimas24h
) {
}
