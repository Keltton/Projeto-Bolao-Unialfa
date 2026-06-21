package com.grupo7.bolao.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.grupo7.bolao.dto.response.DashboardResumoResponse;
import com.grupo7.bolao.service.DashboardService;

import org.springframework.ui.Model;

@Controller
@RequestMapping("/admin")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public String index(Model model) {
        DashboardResumoResponse dashboard = dashboardService.obterResumo();
        model.addAttribute("dashboard", dashboard);
        return "admin/dashboard";
    }
}
