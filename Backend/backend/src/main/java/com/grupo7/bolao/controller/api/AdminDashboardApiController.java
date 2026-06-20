package com.grupo7.bolao.controller.api;

import com.grupo7.bolao.dto.response.DashboardResumoResponse;
import com.grupo7.bolao.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardApiController {

    private final DashboardService dashboardService;

    public AdminDashboardApiController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumoResponse> obterResumo() {
        return ResponseEntity.ok(dashboardService.obterResumo());
    }
}
