---
name: react-patterns
description: "Padrões e princípios modernos do React. Hooks, composição, performance, melhores práticas com TypeScript."
risk: safe
source: community
date_added: "2026-02-27"
---

# Padrões do React (React Patterns)

> Princípios para construir aplicações React prontas para produção.

---

## 1. Princípios de Design de Componentes

### Tipos de Componentes

| Tipo | Uso | Estado (State) |
|------|-----|-------|
| **Server** | Busca de dados (data fetching), estático | Nenhum |
| **Client** | Interatividade | useState, effects |
| **Presentational** | Exibição de UI | Apenas Props |
| **Container** | Lógica/estado | Estado complexo |

### Regras de Design

- Uma única responsabilidade por componente
- Props descem, eventos sobem (Props down, events up)
- Composição sobre herança
- Prefira componentes pequenos e focados

---

## 2. Padrões de Hooks

### Quando Extrair Hooks

| Padrão | Extrair Quando |
|---------|-------------|
| **useLocalStorage** | A mesma lógica de armazenamento for necessária |
| **useDebounce** | Múltiplos valores com debounce |
| **useFetch** | Padrões de busca repetitivos |
| **useForm** | Estado de formulário complexo |

### Regras de Hooks

- Hooks apenas no nível superior (top level)
- Mesma ordem a cada render
- Hooks customizados começam com "use"
- Limpe os effects ao desmontar (on unmount)

---

## 3. Seleção de Gerenciamento de Estado

| Complexidade | Solução |
|------------|----------|
| Simples | useState, useReducer |
| Local compartilhado | Context |
| Estado do servidor | React Query, SWR |
| Global complexo | Zustand, Redux Toolkit |

### Posicionamento de Estado

| Escopo | Onde |
|-------|-------|
| Único componente | useState |
| Pai-filho | Elevação de estado (Lift state up) |
| Subárvore (Subtree) | Context |
| Toda a aplicação | Store global |

---

## 4. Padrões do React 19

### Novos Hooks

| Hook | Propósito |
|------|---------|
| **useActionState** | Estado de submissão de formulário |
| **useOptimistic** | Atualizações otimistas de UI |
| **use** | Ler recursos durante o render |

### Benefícios do Compiler

- Memoization automática
- Menos uso manual de useMemo/useCallback
- Foco em componentes puros

---

## 5. Padrões de Composição

### Componentes Compostos (Compound Components)

- O pai fornece o contexto
- Os filhos consomem o contexto
- Composição flexível baseada em slots
- Exemplo: Tabs, Accordion, Dropdown

### Render Props vs Hooks

| Caso de Uso | Preferir |
|----------|--------|
| Lógica reutilizável | Custom hook |
| Flexibilidade de render | Render props |
| Transversal (Cross-cutting) | Higher-order component |

---

## 6. Princípios de Performance

### Quando Otimizar

| Sinal | Ação |
|--------|--------|
| Renders lentos | Fazer profiling primeiro |
| Listas grandes | Virtualizar |
| Cálculos pesados | useMemo |
| Callbacks estáveis | useCallback |

### Ordem de Otimização

1. Verifique se está realmente lento
2. Faça o profiling com o DevTools
3. Identifique o gargalo (bottleneck)
4. Aplique a correção direcionada

---

## 7. Tratamento de Erros

### Uso de Error Boundary

| Escopo | Posicionamento |
|-------|-----------|
| Toda a aplicação | Nível raiz (Root level) |
| Feature | Nível de rota/feature |
| Componente | Em volta de componente de risco |

### Recuperação de Erros

- Mostrar UI de fallback
- Registrar (log) o erro
- Oferecer opção de tentar novamente
- Preservar os dados do usuário

---

## 8. Padrões do TypeScript

### Tipagem de Props

| Padrão | Uso |
|---------|-----|
| Interface | Props de componentes |
| Type | Unions, complexos |
| Generic | Componentes reutilizáveis |

### Tipos Comuns

| Necessidade | Tipo |
|------|------|
| Children | ReactNode |
| Handler de evento | MouseEventHandler |
| Ref | RefObject<Element> |

---

## 9. Princípios de Testes

| Nível | Foco |
|-------|-------|
| Unitário | Funções puras, hooks |
| Integração | Comportamento do componente |
| E2E | Fluxos do usuário |

### Prioridades de Testes

- Comportamento visível ao usuário
- Casos de borda (edge cases)
- Estados de erro
- Acessibilidade

---

## 10. Anti-Padrões

| ❌ Não faça | ✅ Faça |
|----------|-------|
| Prop drilling profundo | Use context |
| Componentes gigantes | Divida em partes menores |
| useEffect para tudo | Server components |
| Otimização prematura | Fazer profiling primeiro |
| Index como key | ID único estável |

---

## 11. Estrutura de Arquivos

<img width="1150" height="1438" alt="image" src="https://github.com/user-attachments/assets/10369698-472c-4695-a494-2c0672103aa1" />

Use esta imagem como referência para uma melhor estrutura de arquivos para o projeto

---

> **Lembre-se:** O React é sobre composição. Construa componentes pequenos, combine-os com inteligência.

## Quando Usar
Esta skill é aplicável para executar o fluxo de trabalho ou ações descritas na visão geral.

## Limitações
- Use esta skill apenas quando a tarefa corresponder claramente ao escopo descrito acima.
- Não trate a saída como um substituto para validação específica do ambiente, testes ou revisão especializada.
- Pare e peça esclarecimentos se os dados de entrada necessários, permissões, limites de segurança ou critérios de sucesso estiverem ausentes.
