# Especificação: Padrões Arquiteturais e Padrão de Código (Bolão Copa 2026)

Este documento especifica os padrões de design de código, arquitetura e convenções técnicas adotados no **Projeto Bolão Copa 2026** (UniALFA). Todo novo desenvolvimento ou modificação de endpoints, views Thymeleaf ou telas mobile deve seguir rigorosamente estes padrões.

---

## 1. Padrão de API REST e Backend (Java / Spring Boot 4.x)

Os controllers da API devem ser focados exclusivamente no controle de fluxo HTTP, delegando a lógica de negócio e validações para as camadas corretas.

### Controllers e Requisições REST:
- **Segurança (Spring Security & JWT):** Métodos de API devem utilizar anotações de autorização (ex: `@PreAuthorize("hasRole('USER')")` ou `@PreAuthorize("hasRole('ADMIN')")`) para validação de perfis.
- **Camada DTO (Data Transfer Objects):** Nunca exponha entidades JPA diretamente nos retornos dos endpoints. Use DTOs específicos para entrada (`RequestDTO`) e saída (`ResponseDTO`). Isso protege campos sensíveis (como hashes de senhas).
- **Validação de Entrada:** Utilize o Bean Validation nos DTOs de entrada (ex: `@NotBlank`, `@NotNull`, `@Email`, `@Min`, `@Size`) e anote as entradas dos controllers com `@Valid`.
- **Tratamento de Erros:** Toda exceção lançada na camada de serviço (ex: recurso não encontrado, regra de negócio violada) deve ser tratada centralizadamente por um `@ControllerAdvice`. O retorno deve ser formatado em um JSON padrão contendo:
  - `timestamp` (data/hora)
  - `status` (código HTTP)
  - `error` (descrição geral do erro)
  - `message` (mensagem de negócio amigável)

### Camada de Serviços (Services) e Repositórios (Repositories):
- Toda a lógica de negócio, inclusive regras de pontuação (placar exato = 10 pts, acerto de vencedor/empate = 5 pts, erro total = 0 pts) e critérios de desempate, deve estar encapsulada em classes `@Service`.
- Consultas ao banco de dados devem usar `Spring Data JPA` nos Repositórios. Evite queries complexas diretamente no controller.

---

## 2. Padrão do Painel Admin Web (Spring Boot + Thymeleaf + Bootstrap)

O painel administrativo do sistema roda renderizado no servidor usando Thymeleaf e Bootstrap.

### Estrutura de Layout e Views:
- **Layout Base:** Todas as views administrativas devem estender o template base comum usando o Thymeleaf Layout Dialect (ou via `th:replace`/`th:insert`).
- **Feedback Visual:** Exiba alertas Bootstrap para mensagens de sucesso (`th:if="${success}"`) ou erro (`th:if="${error}"`) utilizando a sessão flash do Spring.
- **Ações Críticas:** Ações destrutivas ou críticas (como exclusão de seleções, alteração definitiva de placares de partidas e bloqueio de usuários) devem exigir confirmação prévia através de modais Bootstrap.

---

## 3. Padrão Mobile (React Native + Expo)

O aplicativo mobile consome os endpoints REST e é a interface primária do usuário final.

### Roteamento e Telas:
- **Expo Router:** A navegação deve ser estritamente baseada em rotas de arquivos usando a biblioteca `expo-router`. As pastas de rotas devem seguir a convenção padrão.
- **Tipagem Estrita (TypeScript):** Proíba terminantemente o uso de `any`. Todas as tipagens de interfaces da aplicação (ex: `Usuario.ts`, `Partida.ts`, `Palpite.ts`) devem estar armazenadas na pasta `/types/` e ser importadas de forma consistente.

### Consumo de API (Axios):
- Chamadas HTTP devem centralizar a configuração do Axios (como `baseURL` e injeção do cabeçalho de `Authorization` com o token JWT) em um arquivo de serviço compartilhado (ex: `src/services/api.ts`).
- O token JWT e as preferências locais do usuário devem ser armazenados de forma persistente utilizando o `AsyncStorage` de maneira segura e enxuta.

---

## 4. Modelagem e Performance de Banco de Dados (MySQL)

- **Indexação Otimizada:** Crie índices compostos para otimizar as consultas recorrentes de classificação e ranking. Colunas como pontuação do usuário e data de cadastro (desempate) em `usuarios`, bem como filtros de fase/data em `partidas`, devem estar indexadas.
- **Recálculo de Pontuação em Lote (Batch Processing):** Quando o administrador lançar o resultado de uma partida no painel web, o recálculo dos palpites dos usuários deve ser processado em lote (dividido em blocos/chunks no banco de dados) para evitar estouro de memória (`OutOfMemoryError`) ou timeout no MySQL.
