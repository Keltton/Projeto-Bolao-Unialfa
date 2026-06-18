---
name: clean-code
description: "Esta habilidade incorpora os princípios de \"Código Limpo\" (Clean Code) por Robert C. Martin (Uncle Bob). Use-a para transformar \"código que funciona\" em \"código que é limpo\"."
risk: safe
source: "ClawForge (https://github.com/jackjin1997/ClawForge)"
date_added: "2026-02-27"
---

# Habilidade Clean Code

Esta habilidade incorpora os princípios de "Clean Code" por Robert C. Martin (Uncle Bob). Use-a para transformar "código que funciona" em "código que é limpo".

## 🧠 Filosofia Central
> "O código é limpo se puder ser lido e aprimorado por um desenvolvedor diferente de seu autor original." — Grady Booch

## Quando Usar
Use esta habilidade quando:
- **Escrever novo código**: Para garantir alta qualidade desde o início.
- **Revisar Pull Requests**: Para fornecer feedback construtivo e baseado em princípios.
- **Refatorar código legado**: Para identificar e remover code smells.
- **Melhorar padrões de equipe**: Para alinhar-se às melhores práticas padrão do setor.

## 1. Nomes Significativos
- **Use Nomes que Revelem a Intenção**: `elapsedTimeInDays` em vez de `d`.
- **Evite Desinformação**: Não use `accountList` se for na verdade um `Map`.
- **Faça Distinções Significativas**: Evite `ProductData` vs `ProductInfo`.
- **Use Nomes Pronunciáveis/Pesquisáveis**: Evite `genymdhms`.
- **Nomes de Classes**: Use substantivos (`Customer`, `WikiPage`). Evite `Manager`, `Data`.
- **Nomes de Métodos**: Use verbos (`postPayment`, `deletePage`).

## 2. Funções
- **Pequenas!**: As funções devem ser mais curtas do que você pensa.
- **Faça Uma Coisa**: Uma função deve fazer apenas uma coisa, e fazê-la bem.
- **Um Nível de Abstração**: Não misture lógica de negócios de alto nível com detalhes de baixo nível (como regex).
- **Nomes Descritivos**: `isPasswordValid` é melhor do que `check`.
- **Argumentos**: 0 é o ideal, 1-2 é aceitável, 3+ exige uma justificativa muito forte.
- **Sem Efeitos Colaterais**: Funções não devem alterar secretamente o estado global.

## 3. Comentários
- **Não Comente Código Ruim — Escreva-o Novamente**: A maioria dos comentários é um sinal de falha em nos expressarmos no código.
- **Explique-se no Código**: 
  ```python
  # Check if employee is eligible for full benefits
  if employee.flags & HOURLY and employee.age > 65:
  ```
  vs
  ```python
  if employee.isEligibleForFullBenefits():
  ```
- **Bons Comentários**: Legais, Informativos (intenção de regex), Clarificação (bibliotecas externas), TODOs.
- **Comentários Ruins**: Murmúrios, Redundantes, Enganosos, Obrigatórios, Ruído, Marcadores de Posição.

## 4. Formatação
- **A Metáfora do Jornal**: Conceitos de alto nível no topo, detalhes na parte inferior.
- **Densidade Vertical**: Linhas relacionadas devem estar próximas umas das outras.
- **Distância**: Variáveis devem ser declaradas próximas ao seu uso.
- **Indentação**: Essencial para a legibilidade estrutural.

## 5. Objetos e Estruturas de Dados
- **Abstração de Dados**: Oculte a implementação por trás de interfaces.
- **A Lei de Demeter**: Um módulo não deve conhecer o interior dos objetos que manipula. Evite `a.getB().getC().doSomething()`.
- **Data Transfer Objects (DTO)**: Classes com variáveis públicas e sem funções.

## 6. Tratamento de Erros
- **Use Exceções em vez de Códigos de Retorno**: Mantém a lógica limpa.
- **Escreva Try-Catch-Finally Primeiro**: Define o escopo da operação.
- **Não Retorne Null**: Isso força o chamador a verificar null todas as vezes.
- **Não Passe Null**: Leva a `NullPointerException`.

## 7. Testes Unitários
- **As Três Leis do TDD**:
  1. Não escreva código de produção até ter um teste unitário que falhe.
  2. Não escreva mais de um teste unitário do que o suficiente para falhar.
  3. Não escreva mais código de produção do que o suficiente para passar no teste que falhou.
- **Princípios F.I.R.S.T.**: Fast, Independent, Repeatable, Self-Validating, Timely.

## 8. Classes
- **Pequenas!**: As classes devem ter uma única responsabilidade (SRP).
- **A Regra do Passo Abaixo (Stepdown Rule)**: Queremos que o código seja lido como uma narrativa de cima para baixo.

## 9. Smells e Heurísticas
- **Rigidez**: Difícil de mudar.
- **Fragilidade**: Quebra em muitos lugares.
- **Imobilidade**: Difícil de reutilizar.
- **Viscosidade**: Difícil de fazer a coisa certa.
- **Complexidade/Repetição Desnecessária**.

## 🛠️ Checklist de Implementação
- [ ] Esta função tem menos de 20 linhas?
- [ ] Esta função faz exatamente uma coisa?
- [ ] Todos os nomes são pesquisáveis e revelam a intenção?
- [ ] Evitei comentários tornando o código mais claro?
- [ ] Estou passando argumentos demais?
- [ ] Existe um teste que falha para esta alteração?

## Limitações
- Use esta habilidade apenas quando a tarefa corresponder claramente ao escopo descrito acima.
- Não trate o resultado como um substituto para validação específica do ambiente, testes ou revisão especializada.
- Pare e peça esclarecimentos se as entradas necessárias, permissões, limites de segurança ou critérios de sucesso estiverem ausentes.
