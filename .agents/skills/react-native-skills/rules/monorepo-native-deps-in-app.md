---
title: Instale Dependências Nativas no Diretório do App
impact: CRITICAL
impactDescription: necessário para o funcionamento do autolinking
tags: monorepo, native, autolinking, installation
---

## Instale Dependências Nativas no Diretório do App

Em um monorepo, pacotes com código nativo devem ser instalados diretamente no diretório do app nativo. O autolinking apenas escaneia o `node_modules` do app — ele não encontrará dependências nativas instaladas em outros pacotes.

**Incorreto (dependência nativa apenas no pacote compartilhado):**

```
packages/
  ui/
  package.json  # has react-native-reanimated
  app/
  package.json  # missing react-native-reanimated
```

O autolinking falha — código nativo não vinculado.

**Correto (dependência nativa no diretório do app):**

```
packages/
  ui/
    package.json  # has react-native-reanimated
  app/
    package.json  # also has react-native-reanimated
```

```json
// packages/app/package.json
{
  "dependencies": {
    "react-native-reanimated": "3.16.1"
  }
}
```

Mesmo que o pacote compartilhado utilize a dependência nativa, o app também deve listá-la para que o autolinking detecte e vincule o código nativo.
