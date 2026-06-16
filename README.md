# Bolão Copa do Mundo 2026

Aplicativo de bolão para a Copa do Mundo FIFA 2026, no qual usuários cadastrados realizam palpites sobre os placares das partidas e competem entre si em um ranking geral.

Projeto desenvolvido para o Hackathon da disciplina de Frameworks Java e Desenvolvimento Mobile — Tecnologia em Sistemas para Internet, UniALFA.

## Visão Geral

O sistema é dividido em três artefatos principais:

1. **Backend + API REST** — Java 21+, Spring Boot 4.x, responsável por toda a regra de negócio, autenticação e persistência.
2. **App Mobile** — React Native (Expo), consumido pelo usuário final para cadastro, login, palpites e ranking.
3. **Painel Admin Web** — Spring Boot + Thymeleaf, usado pelo administrador para gerenciar seleções, partidas, resultados e usuários.
4. **Banco de Dados** — MySQL, armazenando usuários, seleções, partidas e palpites.

A comunicação entre o app mobile/painel admin e o backend é feita via HTTPS, com payloads JSON e autenticação por JWT.

## Funcionalidades

### Usuário Comum (App Mobile)
- Cadastro e login com e-mail e senha
- Recuperação de senha
- Edição de perfil (nome e avatar)
- Visualização de partidas, filtradas por fase, data e status
- Registro e edição de palpites (placar) até o início da partida
- Histórico de palpites com pontuação obtida
- Ranking geral com posição destacada do usuário logado

### Administrador (Painel Web)
- Login restrito ao perfil ADMIN
- CRUD de seleções e partidas
- Lançamento e edição de resultados, com recálculo automático de pontuação
- Listagem, busca e bloqueio de usuários
- Dashboard com indicadores (usuários, palpites, partidas pendentes, usuários ativos)

## Regras de Pontuação

| Resultado do palpite | Pontos |
|---|---|
| Placar exato | 10 |
| Acerto apenas do vencedor ou empate | 5 |
| Erro total | 0 |

Critério de desempate no ranking: maior número de placares exatos; persistindo o empate, data de cadastro mais antiga.

## Tecnologias

**Backend**
- Java 21+
- Spring Boot 4.x (Web, Data JPA, Security)
- MySQL
- Thymeleaf + Bootstrap (painel admin)
- Autenticação via JWT, com perfis USER e ADMIN

**Mobile**
- React Native (Expo, expo-router)
- TypeScript
- Axios para consumo da API
- AsyncStorage para armazenamento local

## Estrutura do Repositório (Frontend)

```
bolao-hackaton/
├── assets/          # Imagens, ícones e fontes
├── Components/      # Componentes React reutilizáveis
├── scripts/         # Scripts auxiliares
├── services/        # Configuração de API (axios) e chamadas ao backend
├── src/             # Código-fonte da aplicação
├── types/           # Tipagens TypeScript (Usuario, Partida, Palpite, etc.)
├── app.json         # Configuração do Expo
├── package.json
└── tsconfig.json
```

## Como Executar

### Pré-requisitos
- Node.js
- Expo CLI (`npx expo`)
- Java 21+
- MySQL
- Maven ou Gradle (conforme configuração do backend)

### Mobile

```bash
cd frontend/bolao-hackaton
npm install
npx expo start
```

Escaneie o QR code com o app Expo Go, ou pressione `a`/`i` para abrir em um emulador Android/iOS.

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Configure as credenciais do MySQL e o segredo JWT nas variáveis de ambiente ou em `application.properties` antes de iniciar.

## Atores do Sistema

- **Usuário Comum** — cadastra-se no app, realiza palpites e acompanha o ranking.
- **Administrador** — gerencia o campeonato pelo painel web.

## Escopo do MVP

- Sistema de pontuação clássico (placar exato + vencedor/empate).
- Apenas ranking geral, sem grupos privados ou ligas.
- Aplicativo gratuito, sem premiação ou pagamentos integrados.
- Resultados das partidas lançados manualmente pelo administrador, sem integração com APIs externas de dados esportivos.
