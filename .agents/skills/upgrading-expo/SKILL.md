---
name: upgrading-expo
description: "Atualizar versões do Expo SDK"
risk: safe
source: "https://github.com/expo/skills/tree/main/plugins/upgrading-expo"
date_added: "2026-02-27"
---

# Atualizando o Expo

## Visão Geral

Atualize as versões do Expo SDK com segurança, tratando breaking changes, dependências e atualizações de configuração.

## Quando Usar Esta Skill

Use esta skill quando precisar atualizar as versões do Expo SDK.

Use esta skill quando:
- Estiver atualizando para uma nova versão do Expo SDK
- Estiver lidando com breaking changes entre versões do SDK
- Estiver atualizando dependências para compatibilidade
- Estiver migrando APIs obsoletas (deprecated) para novas versões
- Estiver preparando aplicativos para novos recursos do Expo

## Instruções

Esta skill orienta você na atualização das versões do Expo SDK:

1. **Planejamento Pré-Upgrade**: Revise as release notes e breaking changes
2. **Atualizações de Dependências**: Atualize os pacotes para compatibilidade com o SDK
3. **Migração de Configuração**: Atualize o app.json e arquivos de configuração
4. **Atualizações de Código**: Migre APIs obsoletas (deprecated) para novas versões
5. **Testes**: Verifique a funcionalidade do aplicativo após o upgrade

## Processo de Upgrade

### 1. Checklist Pré-Upgrade

- Revise as release notes do Expo SDK
- Identifique breaking changes que afetam seu aplicativo
- Verifique a compatibilidade de pacotes de terceiros
- Faça backup do estado atual do projeto
- Crie uma feature branch para o upgrade

### 2. Atualizar o Expo SDK

```bash
# Update Expo CLI
npm install -g expo-cli@latest

# Upgrade Expo SDK
npx expo install expo@latest

# Update all Expo packages
npx expo install --fix
```

### 3. Tratar Breaking Changes

- Revise os guias de migração para breaking changes
- Atualize chamadas de API obsoletas (deprecated)
- Modifique os arquivos de configuração conforme necessário
- Atualize dependências nativas se necessário
- Teste minuciosamente os recursos afetados

### 4. Atualizar Dependências

```bash
# Check for outdated packages
npx expo-doctor

# Update packages to compatible versions
npx expo install --fix

# Verify compatibility
npx expo-doctor
```

### 5. Testes

- Teste a funcionalidade principal do aplicativo
- Verifique se os módulos nativos funcionam corretamente
- Verifique se há erros em runtime
- Teste no iOS e no Android
- Verifique se as builds para as lojas de aplicativos ainda funcionam

## Problemas Comuns

### Conflitos de Dependências

- Use `expo install` em vez de `npm install` para pacotes do Expo
- Verifique a compatibilidade do pacote com a nova versão do SDK
- Resolva alertas de peer dependencies

### Alterações de Configuração

- Atualize o `app.json` para os novos requisitos do SDK
- Migre opções de configuração obsoletas (deprecated)
- Atualize os arquivos de configuração nativos, se necessário

### Alterações de API (Breaking Changes)

- Revise os guias de migração de API
- Atualize o código para usar as novas APIs
- Teste os recursos afetados após as alterações

## Melhores Práticas

- Sempre faça o upgrade em uma feature branch
- Teste minuciosamente antes de realizar o merge
- Revise as release notes com atenção
- Atualize as dependências de forma incremental
- Mantenha o Expo CLI atualizado
- Use o `expo-doctor` para verificar a configuração

## Recursos

Para mais informações, consulte o [repositório de origem](https://github.com/expo/skills/tree/main/plugins/upgrading-expo).

## Limitações
- Use esta skill apenas quando a tarefa corresponder claramente ao escopo descrito acima.
- Não trate a saída como um substituto para validação específica do ambiente, testes ou revisão especializada.
- Pare e peça esclarecimentos se entradas obrigatórias, permissões, limites de segurança ou critérios de sucesso estiverem ausentes.
