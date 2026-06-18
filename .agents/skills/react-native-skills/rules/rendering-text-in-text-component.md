---
title: Envolva Strings em Componentes Text
impact: CRITICAL
impactDescription: previne quebras (crashes) em tempo de execução
tags: rendering, text, core
---

## Envolva Strings em Componentes Text

Strings devem ser renderizadas dentro de `<Text>`. O React Native quebra (crashes) se uma string for filha direta de `<View>`.

**Incorreto (quebra/crashes):**

```tsx
import { View } from 'react-native'

function Greeting({ name }: { name: string }) {
  return <View>Hello, {name}!</View>
}
// Error: Text strings must be rendered within a <Text> component.
```

**Correto:**

```tsx
import { View, Text } from 'react-native'

function Greeting({ name }: { name: string }) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  )
}
```
