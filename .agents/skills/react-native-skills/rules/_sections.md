# Seções

Este arquivo define todas as seções, suas ordens, níveis de impacto e descrições.
O ID da seção (entre parênteses) é o prefixo do nome de arquivo usado para agrupar regras.

---

## 1. Renderização Principal (rendering)

**Impacto:** CRITICAL  
**Descrição:** Regras fundamentais de renderização em React Native. Violações causam crashes em tempo de execução ou quebra de UI.

## 2. Performance de Lista (list-performance)

**Impacto:** HIGH  
**Descrição:** Otimização de listas virtualizadas (FlatList, LegendList, FlashList) para rolagem fluida e atualizações rápidas.

## 3. Animação (animation)

**Impacto:** HIGH  
**Descrição:** Animações aceleradas por GPU, padrões do Reanimated e prevenção de renderizações excessivas (render thrashing) durante gestos.

## 4. Performance de Rolagem (scroll)

**Impacto:** HIGH  
**Descrição:** Rastreamento da posição de rolagem sem causar renderizações excessivas (render thrashing).

## 5. Navegação (navigation)

**Impacto:** HIGH  
**Descrição:** Uso de navegadores nativos para navegação de pilha (stack) e abas (tab) em vez de alternativas baseadas em JS.

## 6. Estado do React (react-state)

**Impacto:** MEDIUM  
**Descrição:** Padrões para gerenciar estado do React a fim de evitar closures desatualizadas (stale closures) e re-renderizações desnecessárias.

## 7. Arquitetura de Estado (state)

**Impacto:** MEDIUM  
**Descrição:** Princípios da verdade absoluta (ground truth) para variáveis de estado e valores derivados.

## 8. Compilador do React (react-compiler)

**Impacto:** MEDIUM  
**Descrição:** Padrões de compatibilidade do React Compiler com React Native e Reanimated.

## 9. Interface do Usuário (ui)

**Impacto:** MEDIUM  
**Descrição:** Padrões nativos de UI para imagens, menus, modais, estilização e interfaces consistentes com a plataforma.

## 10. Sistema de Design (design-system)

**Impacto:** MEDIUM  
**Descrição:** Padrões de arquitetura para construir bibliotecas de componentes sustentáveis.

## 11. Monorepo (monorepo)

**Impacto:** LOW  
**Descrição:** Gerenciamento de dependências e configuração de módulos nativos em monorepos.

## 12. Dependências de Terceiros (imports)

**Impacto:** LOW  
**Descrição:** Envelopamento (wrapping) e re-exportação de dependências de terceiros para fins de manutenibilidade.

## 13. JavaScript (js)

**Impacto:** LOW  
**Descrição:** Micro-otimizações, como o hoisting de criação de objetos custosos.

## 14. Fontes (fonts)

**Impacto:** LOW  
**Descrição:** Carregamento nativo de fontes para melhoria de performance.
