# Backend API & Admin Web - Bolão Copa 2026 ☕⚽

Este diretório contém o código-fonte do **Backend** do **Bolão Copa do Mundo 2026**. O backend fornece uma API REST para o aplicativo mobile e serve o Painel Administrativo Web renderizado no servidor.

---

## Tecnologias Empregadas

*   **Linguagem:** Java 21+
*   **Framework:** Spring Boot 4.x
*   **Persistência:** Spring Data JPA + Hibernate
*   **Segurança:** Spring Security com autenticação stateless por tokens JWT
*   **Banco de Dados:** MySQL 8.x
*   **Painel Administrativo:** Thymeleaf Layout Dialect + Bootstrap 5
*   **Validação:** Hibernate Validator (Bean Validation)

---

## Estrutura do Projeto Java

O projeto está estruturado em pacotes organizados por responsabilidade única (**SRP**):

```text
src/main/java/com/grupo7/bolao/
├── config/             # Configurações do Spring (MVC, Segurança, Detalhes de Usuário)
├── controller/
│   ├── api/            # API REST Controllers consumidos pelo App Mobile
│   └── web/            # MVC Controllers (Thymeleaf) para o Painel Admin Web
├── dto/
│   ├── request/        # DTOs de entrada para validação de dados
│   └── response/       # DTOs de saída para omitir campos sensíveis
├── enums/              # Definições de Enums do domínio (Status, Fases, Critérios)
├── exception/          # Tratamento de Erros Global (@ControllerAdvice)
├── model/              # Entidades JPA mapeadas para o banco de dados MySQL
├── repository/         # Interfaces do Spring Data JPA de acesso ao banco
└── service/
    ├── auth/           # Lógica do JWT (Filtros, Geração e Validação de Tokens)
    └── [Modulos]/      # Regras de Negócio (Cálculo de pontos, processamento em lote)
```

---

## Requisitos de Banco de Dados (MySQL)

Para garantir performance nas buscas e recálculo, crie índices para as seguintes colunas:
*   Tabela de `usuarios`: Indexar coluna de `pontuacao_total` e `criado_em` para ordenação rápida do ranking geral.
*   Tabela de `partidas`: Indexar colunas de `data_hora` e `fase` para agilização de filtros.

---

## Como Executar

### 1. Configurar o Banco de Dados

1. Certifique-se de que o servidor do MySQL/MariaDB está ativo na sua máquina.
2. Crie uma base de dados vazia para o bolão:
   ```sql
   CREATE DATABASE bolao_grupo7;
   ```
3. O arquivo `src/main/resources/application.properties` já vem configurado para se conectar à porta `3306` e ao banco `bolao_grupo7` com usuário `root` e senha vazia por padrão. Caso precise alterar, ajuste as propriedades:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bolao_grupo7?useSSL=false&serverTimezone=America/Sao_Paulo&allowPublicKeyRetrieval=true
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   ```
4. **Usuário Administrador Pré-registrado**: Para entrar no sistema, já existe um administrador cadastrado no banco:
   - **E-mail:** `daniel@admin.com`
   - **Senha:** `admin123`

---

### 2. Iniciar a Aplicação

A partir do diretório `Backend/backend`, execute o comando correspondente ao seu sistema operacional:

*   **No Windows (PowerShell/CMD):**
    ```bash
    ./mvnw.cmd spring-boot:run
    ```
*   **No macOS / Linux:**
    ```bash
    ./mvnw spring-boot:run
    ```

Após a inicialização:
*   A **API REST** estará escutando no endereço `http://localhost:8080/api`.
*   O **Painel Administrativo** estará acessível em `http://localhost:8080/login` para o administrador logar.
