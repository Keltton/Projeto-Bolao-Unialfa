# Script de Verificação Geral do Projeto Bolão Copa 2026 (Windows PowerShell)
# Este script valida a compilação do Backend (Java) e o TypeScript do Frontend (React Native).

$ErrorActionPreference = "Stop"

Write-Host "Iniciando verificacao completa do projeto no Windows..." -ForegroundColor Cyan

# 1. Verificar Frontend (TypeScript)
Write-Host ""
Write-Host "[1/2] Verificando compilador TypeScript no Frontend..." -ForegroundColor Yellow
Push-Location Frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules nao encontrado no Frontend. Executando npm install..." -ForegroundColor Yellow
    & "C:\Program Files\nodejs\npm.cmd" install
}

& "C:\Program Files\nodejs\npx.cmd" tsc --noEmit
$TSC_STATUS = $LASTEXITCODE
Pop-Location

if ($TSC_STATUS -eq 0) {
    Write-Host "[OK] TypeScript verificado com sucesso no Frontend! Sem erros de tipagem." -ForegroundColor Green
} else {
    Write-Host "[ERRO] Erro de compilacao detectado no TypeScript do Frontend." -ForegroundColor Red
    exit 1
}

# 2. Verificar Backend (Java)
Write-Host ""
Write-Host "[2/2] Verificando compilacao do Backend (Java/Spring Boot)..." -ForegroundColor Yellow
Push-Location Backend/backend

if (Test-Path "mvnw.cmd") {
    & .\mvnw.cmd clean compile test-compile -DskipTests
    $MVN_STATUS = $LASTEXITCODE
} else {
    Write-Host "Wrapper Maven (mvnw.cmd) nao encontrado em Backend/backend." -ForegroundColor Red
    $MVN_STATUS = 1
}
Pop-Location

if ($MVN_STATUS -eq 0) {
    Write-Host ""
    Write-Host "[OK] Backend Java compilado com sucesso! Sem erros de sintaxe." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[ERRO] Erro ao compilar o Backend Java." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[OK] Projeto verificado com sucesso! Pronto para commits." -ForegroundColor Green
exit 0
