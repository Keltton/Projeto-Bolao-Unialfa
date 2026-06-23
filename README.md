# Bolão Copa do Mundo 2026 ⚽🏆

Aplicativo de bolão para a Copa do Mundo FIFA 2026, no qual usuários cadastrados realizam palpites sobre os placares das partidas e competem entre si em um ranking geral.

Projeto desenvolvido para o Hackathon da disciplina de Frameworks Java e Desenvolvimento Mobile — Tecnologia em Sistemas para Internet, UniALFA.

---

## Visão Geral

O sistema é dividido em três artefatos principais integrados:

1.  **Backend + API REST** — Java 21+, Spring Boot 4.x. É responsável por toda a regra de negócio (autenticação JWT, processamento de pontuações em lote, soft delete e validações).
2.  **App Mobile** — React Native (Expo SDK 56) com TypeScript, contendo a jornada do participante (cadastro, login, palpites, ranking e perfil).
3.  **Painel Admin Web** — Interface administrativa renderizada no servidor via Thymeleaf + Bootstrap, usada para gerenciar seleções, partidas, resultados e moderação de usuários.
4.  **Banco de Dados** — Banco de dados relacional MySQL otimizado com indexações e queries de classificação.

---

## Estrutura do Monorepo

```text
Projeto-Bolao-Unialfa/
├── Backend/
│   └── backend/          # Projeto Java (Maven/Spring Boot)
├── Frontend/
│   ├── assets/           # Imagens, bandeiras e fontes
│   └── src/
│       ├── app/          # Rotas e navegação do Expo Router
│       │   ├── (tabs)/   # Abas da área logada (Início, Partidas, Palpites, Ranking, Perfil)
│       │   ├── auth/     # Fluxo de login, cadastro, recuperação e nova senha
│       │   └── partidas/ # Telas dinâmicas de palpitar
│       ├── components/   # Componentes visuais comuns
│       ├── constants/    # Tema, espaçamentos e constantes
│       ├── services/     # Central de chamadas de API (Axios e AsyncStorage)
│       └── types/        # Definições estritas de tipos TypeScript do domínio
└── README.md
```

---

## Regras de Pontuação

Considerando o palpite **P** (gols mandante: `pm`, visitante: `pv`) e o resultado oficial da partida **R** (mandante: `rm`, visitante: `rv`):

*   **Placar Exato (10 pontos):** Se `pm = rm` E `pv = rv`.
*   **Vencedor/Empate (5 pontos):** Se o vencedor ou o empate foi acertado, mas com placar diferente (ex: `sign(pm - pv) = sign(rm - rv)`).
*   **Erro Total (0 pontos):** Qualquer outro palpite.

> [!NOTE]
> **Critério de Desempate no Ranking:** 
> 1. Maior número de placares exatos.
> 2. Data de cadastro mais antiga (criado_em).

---

## Como Executar

### Pré-requisitos
*   Node.js (LTS recomendado)
*   Java Development Kit (JDK) 21+
*   Banco de dados MySQL / MariaDB (ex: XAMPP) rodando na porta `3306`
*   Expo Go instalado no celular físico ou emulador (iOS/Android) configurado

---

### Configuração e Execução do Banco de Dados

1. Certifique-se de que o MySQL está em execução (por exemplo, iniciando o módulo MySQL no **XAMPP Control Panel**).
2. Crie uma base de dados vazia para o bolão:
   ```sql
   CREATE DATABASE bolao_grupo7;
   ```
3. O projeto já está pré-configurado no arquivo `src/main/resources/application.properties` para acessar o banco `bolao_grupo7` na porta `3306` com usuário `root` e senha em branco.
4. **Administrador Pré-registrado**: Para testes e login inicial no painel admin ou no app, utilize a conta:
   - **E-mail:** `daniel@admin.com`
   - **Senha:** `admin123`

---

### Executando o Backend (API e Painel Admin)

1. Entre no diretório do backend:
   ```bash
   cd Backend/backend
   ```
2. Inicie o backend:
   *   **Windows (PowerShell/CMD):**
       ```bash
       ./mvnw.cmd spring-boot:run
       ```
   *   **macOS / Linux:**
       ```bash
       ./mvnw spring-boot:run
       ```

A API REST estará rodando em `http://localhost:8080` e o Painel Admin Web poderá ser acessado pelo navegador em `http://localhost:8080/login`.

---

### Executando o App Mobile (React Native + Expo)

1. Entre no diretório do frontend:
   ```bash
   cd Frontend
   ```
2. Instale as dependências do projeto:
   *   **Windows (PowerShell):**
       ```bash
       npm.cmd install
       ```
   *   **macOS / Linux / Windows (CMD):**
       ```bash
       npm install
       ```
3. Inicie o servidor bundler do Expo:
   *   **Windows (PowerShell):**
       ```bash
       npx.cmd expo start
       ```
   *   **macOS / Linux / Windows (CMD):**
       ```bash
       npx expo start
       ```
4. Escaneie o QR Code exibido com o aplicativo **Expo Go** (Android) ou a câmera do celular (iOS) conectado na mesma rede sem fio, ou pressione `a` (emulador Android) / `i` (simulador iOS).

---

## Atores do Sistema

*   **Usuário Comum (Mobile):** cadastra-se no aplicativo, realiza palpites para partidas futuras, confere pontos de partidas finalizadas e acompanha a classificação global.
*   **Administrador (Admin Web):** acessa a plataforma administrativa para gerenciar o cadastro de seleções, partidas, cadastrar e editar placares (que dispara o recálculo dos pontos dos palpites) e moderar os usuários.
