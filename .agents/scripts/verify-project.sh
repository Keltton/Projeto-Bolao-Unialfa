#!/bin/bash

# Script de Verificação Geral do Projeto Bolão Copa 2026
# Este script valida a compilação do Backend (Java) e o TypeScript do Frontend (React Native).

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BOLD}Iniciando verificação completa do projeto...${NC}\n"

# Carregar NVM se disponível
export NVM_DIR="/home/danielpereira/.nvm"
if [ ! -d "$NVM_DIR" ]; then
    export NVM_DIR="$HOME/.nvm"
fi

if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
fi

# 1. Verificar Frontend (TypeScript)
echo -e "${BOLD}[1/2] Verificando compilador TypeScript no Frontend...${NC}"
cd Frontend || exit 1
if [ -d "node_modules" ]; then
    npx tsc --noEmit
    TSC_STATUS=$?
else
    echo -e "${RED}node_modules não encontrado no Frontend. Executando npm install...${NC}"
    npm install && npx tsc --noEmit
    TSC_STATUS=$?
fi

if [ $TSC_STATUS -eq 0 ]; then
    echo -e "${GREEN}✔ TypeScript verificado com sucesso no Frontend! Sem erros de tipagem.${NC}\n"
else
    echo -e "${RED}✘ Erro de compilação detectado no TypeScript do Frontend.${NC}\n"
    exit 1
fi
cd ..

# 2. Verificar Backend (Java)
echo -e "${BOLD}[2/2] Verificando compilação do Backend (Java/Spring Boot)...${NC}"
cd Backend/backend || exit 1
if [ -f "mvnw" ]; then
    chmod +x mvnw
    ./mvnw clean compile test-compile -DskipTests
    MVN_STATUS=$?
else
    echo -e "${RED}Wrapper Maven (mvnw) não encontrado em Backend/backend.${NC}"
    MVN_STATUS=1
fi

if [ $MVN_STATUS -eq 0 ]; then
    echo -e "${GREEN}✔ Backend Java compilado com sucesso! Sem erros de sintaxe.${NC}\n"
else
    echo -e "${RED}✘ Erro ao compilar o Backend Java.${NC}\n"
    exit 1
fi
cd ../..

echo -e "${GREEN}${BOLD}✔ Projeto verificado com sucesso! Pronto para commits.${NC}"
exit 0
