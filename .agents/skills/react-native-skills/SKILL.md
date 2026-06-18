---
name: react-native-skills
description: "Use ao trabalhar com tarefas ou fluxos de trabalho de react-native-skills"
risk: safe
source: "https://github.com/vercel-labs/agent-skills"
date_added: "2026-06-02"
---

# React Native Skills

Boas práticas abrangentes para aplicativos React Native e Expo. Contém regras em várias categorias cobrindo performance, animações, padrões de UI e otimizações específicas de plataforma.

## Quando Usar
Consulte estas diretrizes quando:

- Desenvolver aplicativos React Native ou Expo
- Otimizar a performance de listas e rolagem (scroll)
- Implementar animações com Reanimated
- Trabalhar com imagens e mídia
- Configurar módulos nativos ou fontes
- Estruturar projetos monorepo com dependências nativas

## Categorias de Regras por Prioridade

| Prioridade | Categoria         | Impacto   | Prefixo              |
| ---------- | ----------------- | --------- | -------------------- |
| 1          | List Performance  | CRÍTICO   | `list-performance-`  |
| 2          | Animation         | ALTO      | `animation-`         |
| 3          | Navigation        | ALTO      | `navigation-`        |
| 4          | UI Patterns       | ALTO      | `ui-`                |
| 5          | State Management  | MÉDIO     | `react-state-`       |
| 6          | Rendering         | MÉDIO     | `rendering-`         |
| 7          | Monorepo          | MÉDIO     | `monorepo-`          |
| 8          | Configuration     | BAIXO     | `fonts-`, `imports-` |

## Referência Rápida

### 1. List Performance (CRÍTICO)

- `list-performance-virtualize` - Use FlashList para listas grandes
- `list-performance-item-memo` - Memoize componentes de itens da lista (list item components)
- `list-performance-callbacks` - Estabilize referências de callbacks
- `list-performance-inline-objects` - Evite objetos de estilo inline
- `list-performance-function-references` - Extraia funções para fora do render
- `list-performance-images` - Otimize imagens em listas
- `list-performance-item-expensive` - Mova tarefas pesadas para fora dos itens da lista
- `list-performance-item-types` - Use tipos de item (item types) para listas heterogêneas

### 2. Animation (ALTO)

- `animation-gpu-properties` - Anime apenas transform e opacity
- `animation-derived-value` - Use useDerivedValue para animações computadas
- `animation-gesture-detector-press` - Use Gesture.Tap em vez de Pressable

### 3. Navigation (ALTO)

- `navigation-native-navigators` - Use stack nativa e tabs nativas em vez de navigators JS

### 4. UI Patterns (ALTO)

- `ui-expo-image` - Use expo-image para todas as imagens
- `ui-image-gallery` - Use Galeria para lightboxes de imagem
- `ui-pressable` - Use Pressable em vez de TouchableOpacity
- `ui-safe-area-scroll` - Trate safe areas em ScrollViews
- `ui-scrollview-content-inset` - Use contentInset para cabeçalhos (headers)
- `ui-menus` - Use menus de contexto nativos
- `ui-native-modals` - Use modals nativos quando possível
- `ui-measure-views` - Use onLayout, não measure()
- `ui-styling` - Use StyleSheet.create ou Nativewind

### 5. State Management (MÉDIO)

- `react-state-minimize` - Minimize inscrições de estado (state subscriptions)
- `react-state-dispatcher` - Use o padrão dispatcher para callbacks
- `react-state-fallback` - Mostre fallback no primeiro render
- `react-compiler-destructure-functions` - Desestruture (destructure) para o React Compiler
- `react-compiler-reanimated-shared-values` - Lide com shared values com o compiler

### 6. Rendering (MÉDIO)

- `rendering-text-in-text-component` - Envolva texto em componentes Text
- `rendering-no-falsy-and` - Evite usar && com valores falsy para renderização condicional

### 7. Monorepo (MÉDIO)

- `monorepo-native-deps-in-app` - Mantenha dependências nativas no pacote do app
- `monorepo-single-dependency-versions` - Use versões únicas em todos os pacotes

### 8. Configuration (BAIXO)

- `fonts-config-plugin` - Use plugins de configuração (config plugins) para fontes personalizadas
- `imports-design-system-folder` - Organize imports do design system
- `js-hoist-intl` - Faça o hoist da criação de objetos Intl

## Como Usar

Leia os arquivos de regras individuais para explicações detalhadas e exemplos de código:

```
rules/list-performance-virtualize.md
rules/animation-gpu-properties.md
```

Cada arquivo de regra contém:

- Breve explicação de por que isso importa
- Exemplo de código incorreto com explicação
- Exemplo de código correto com explicação
- Contexto adicional e referências

## Documento Compilado Completo

Para o guia completo com todas as regras expandidas: `AGENTS.md`

## Limitações
- Use esta skill apenas quando a tarefa corresponder claramente ao escopo descrito acima.
- Não trate a saída como um substituto para validação específica do ambiente, testes ou revisão especializada.
- Pare e peça esclarecimentos se os dados de entrada necessários, permissões, limites de segurança ou critérios de sucesso estiverem ausentes.
