# Frontend Mobile - Bolão Copa 2026 📱⚽

Este diretório contém o código-fonte da aplicação móvel do **Bolão Copa do Mundo 2026**. O aplicativo é voltado para os participantes do bolão realizarem seus palpites e acompanharem a classificação geral do ranking.

---

## Tecnologias Empregadas

*   **Core:** React Native (Expo SDK 56) + React 19
*   **Linguagem:** TypeScript com tipagem estrita
*   **Estilização:** Vanilla CSS StyleSheet + suporte a temas nativos
*   **Roteamento:** Expo Router (File-based Routing)
*   **Comunicação API:** Axios com interceptor para autenticação JWT
*   **Persistência Local:** AsyncStorage (gerenciamento leve de token de sessão)

---

## Estrutura do Projeto

O código-fonte principal está organizado dentro do diretório `/src`:

```text
src/
├── app/                  # Roteador baseado em arquivos (Expo Router)
│   ├── _layout.tsx       # Layout de rotas raiz da pilha do app
│   ├── index.tsx         # Redirecionador inicial de sessão
│   ├── (tabs)/           # Abas principais do usuário autenticado
│   │   ├── _layout.tsx   # Configurações visuais do menu inferior
│   │   ├── index.tsx     # Home / Dashboard de palpites rápidos (Bento Grid)
│   │   ├── partidas.tsx  # Tabela com todos os jogos e filtros rápidos
│   │   ├── palpites.tsx  # Histórico e pontuação obtida nos seus palpites
│   │   ├── ranking.tsx   # Visualização do pódio dos 3 melhores e classificação
│   │   └── perfil.tsx    # Dados cadastrais, editar nome, LGPD e logout
│   ├── auth/             # Telas de fluxo público
│   │   ├── login.tsx     # Autenticação de usuário com design premium
│   │   ├── cadastro.tsx  # Criação de conta
│   │   ├── recuperar-senha.tsx # Solicitação de link por e-mail
│   │   └── nova-senha.tsx      # Redefinição de senha com token
│   └── partidas/
│       └── [id].tsx      # Registro/Edição dinâmica de palpites de uma partida
├── components/           # Componentes globais e elementos comuns
├── constants/
│   └── theme.ts          # Definições de temas (Cores Copa, Espaçamento, Fontes)
├── hooks/                # Hooks customizados (useTheme, useColorScheme)
├── services/
│   └── api.ts            # Instância centralizada do Axios com injeção de JWT
└── types/                # Definições TypeScript estritas (Usuario, Partida, Palpite, etc.)
```

---

## Configuração do Endpoint de API

As chamadas HTTP são centralizadas em `src/services/api.ts`. A variável `API_URL` está configurada para mapear automaticamente o endereço de rede correspondente ao emulador ou ambiente:

*   **iOS Simulator:** Utiliza `http://localhost:8080`
*   **Android Emulator:** Utiliza o IP de loopback `http://10.0.2.2:8080`
*   **Celular Físico:** Substitua pelo IP local da sua máquina host (ex: `http://192.168.x.x:8080`), garantindo que o celular e o computador estejam na mesma rede Wi-Fi.

---

## Como Executar

### 1. Instalar as Dependências

No diretório `Frontend/`, execute:

*   **No Windows (PowerShell):**
    ```bash
    npm.cmd install
    ```
*   **No macOS / Linux / Windows (CMD):**
    ```bash
    npm install
    ```

---

### 2. Iniciar o Servidor Expo

*   **No Windows (PowerShell):**
    ```bash
    npx.cmd expo start
    ```
*   **No macOS / Linux / Windows (CMD):**
    ```bash
    npx expo start
    ```

Após iniciar, o terminal exibirá um **QR Code**. 

*   **No Android:** Baixe o aplicativo **Expo Go** na Google Play Store, abra-o e selecione "Scan QR Code".
*   **No iOS:** Abra o aplicativo padrão da Câmera do seu iPhone e aponte para o QR Code para abrir o Expo Go.
*   **Emuladores:** Pressione `a` no terminal para abrir o emulador Android conectado ou `i` para o simulador iOS.
