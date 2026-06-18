---
title: Use Versões Únicas de Dependências no Monorepo
impact: MEDIUM
impactDescription: evita bundles duplicados, conflitos de versão
tags: monorepo, dependencies, installation
---

## Use Versões Únicas de Dependências no Monorepo

Use uma única versão de cada dependência em todos os pacotes do seu monorepo.
Prefira versões exatas em vez de intervalos de versões. Múltiplas versões causam código duplicado em
bundles, conflitos em tempo de execução (runtime) e comportamento inconsistente entre os pacotes.

Use uma ferramenta como o syncpack para impor isso. Como último recurso, use yarn resolutions
ou npm overrides.

**Incorreto (intervalos de versões, múltiplas versões):**

```json
// packages/app/package.json
{
  "dependencies": {
    "react-native-reanimated": "^3.0.0"
  }
}

// packages/ui/package.json
{
  "dependencies": {
    "react-native-reanimated": "^3.5.0"
  }
}
```

**Correto (versões exatas, única fonte de verdade):**

```json
// package.json (root)
{
  "pnpm": {
    "overrides": {
      "react-native-reanimated": "3.16.1"
    }
  }
}

// packages/app/package.json
{
  "dependencies": {
    "react-native-reanimated": "3.16.1"
  }
}

// packages/ui/package.json
{
  "dependencies": {
    "react-native-reanimated": "3.16.1"
  }
}
```

Use o recurso de override/resolution do seu gerenciador de pacotes para impor as versões na raiz.
Ao adicionar dependências, especifique versões exatas sem `^` ou `~`.
