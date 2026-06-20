# Especificação: Boas Práticas de Desenvolvimento (Bolão Copa 2026)

Este documento descreve os padrões recomendados de commits, escrita de código, comentários e princípios de design que devem ser seguidos por todos os desenvolvedores e agentes de IA no **Projeto Bolão Copa 2026**.

---

## 1. Padrão de Commits (Conventional Commits em PT-BR)

Sempre adote o padrão **Conventional Commits** adaptado para a língua portuguesa (Português do Brasil). A estrutura geral deve seguir:

```text
<tipo>(<escopo>): <descrição curta em PT-BR>

[corpo detalhado se for uma alteração Normal ou Major]
```

### Tipos de Commit Permitidos:
*   `feat`: Nova funcionalidade para o usuário final (ex: tela de palpites ou novos relatórios).
*   `fix`: Correção de bug (ex: erro no cálculo de pontos ou falha de layout).
*   `docs`: Mudanças apenas na documentação.
*   `style`: Alterações que não afetam o significado do código (espaços em branco, formatação, CSS/Bootstrap).
*   `refactor`: Alteração de código que não corrige um bug nem adiciona funcionalidade (refatoração de Service/Controller).
*   `test`: Adição ou modificação de testes unitários ou de integração.
*   `chore`: Atualizações de tarefas de build, dependências do npm/pom.xml, etc.

### Escopos Comuns do Projeto:
*   `api`: Backend Spring Boot (REST).
*   `mobile`: Aplicativo React Native (Expo).
*   `admin`: Painel Web administrativo (Thymeleaf/Bootstrap).
*   `db`: Script SQL, migrations ou alterações de modelagem no MySQL.
*   `docs`: Documentações do projeto (README, .agents, etc.).

### Regras de Descrição por Escala de Mudança:
1.  **Mudanças Pequenas (Minor/Triviais):**
    *   Descrição curta na linha do título. Sem necessidade de corpo.
    *   Exemplo: `fix(mobile): corrigir alinhamento do avatar na tela de perfil`
2.  **Mudanças Normais e Grandes (Normal/Major):**
    *   Título curto e objetivo no commit.
    *   **Obrigatório** incluir um corpo (body) de commit detalhando o que foi alterado, o motivo técnico da mudança e os principais arquivos modificados.
    *   Exemplo:
        ```text
        feat(api): otimizar cálculo de pontos dos palpites em lote

        - Altera a lógica de atualização de pontuação pós-partida no PartidaService.
        - Implementa processamento em lote (Spring Batch/Pagination) com blocos de 500 registros.
        - Cria índice composto na tabela de palpites para acelerar o recalculo.
        ```

---

## 2. Padrão de Comentários no Código

- **Comentários de Código Geral:** Escreva código autoexplicativo (nomes de variáveis e métodos claros). Utilize comentários apenas para documentar lógicas complexas ou regras de negócio especiais (como a regra específica do bolão).
- **Comentários em Views Thymeleaf:**
  - **Nunca** utilize comentários HTML comuns (`<!-- comentário -->`) nas views Thymeleaf para documentar lógicas internas do sistema. Esses comentários chegam ao navegador do cliente em produção.
  - **Sempre** utilize comentários nativos do Thymeleaf (`<!--/* comentário */-->`). Estes são removidos em tempo de renderização no servidor e nunca chegam ao cliente.
- **Comentários em TypeScript/Java:** Use os comentários de barra dupla `//` ou blocos padrão `/* ... */` mantendo o código conciso e limpo.

---

## 3. Princípios de Design de Código (Clean Code)

Ao criar novos códigos ou funcionalidades, sempre projete a arquitetura tendo em mente:

1.  **DRY (Don't Repeat Yourself):**
    *   Evite duplicação de lógica. No mobile, extraia interfaces visuais comuns para a pasta `Components/`. No painel administrativo Thymeleaf, use fragmentos reutilizáveis (`th:fragment`). No Java, extraia lógicas comuns de persistência ou negócio para Services ou Classes Utilitárias.
2.  **Encapsulamento Eficiente:**
    *   Mantenha modificadores de acesso corretos em Java (`private`, `protected`, `public`). DTOs devem ser expostos em detrimento a entidades JPA brutas.
    *   Toda a lógica complexa (ex: pontuação) deve ser tratada dentro das Services, mantendo os Controllers enxutos.
3.  **Princípio da Responsabilidade Única (SRP):**
    *   Cada classe ou arquivo deve ter apenas um motivo para mudar. Controllers apenas tratam a requisição/resposta, DTOs apenas carregam dados, Services executam lógica e Repositories cuidam da persistência.
