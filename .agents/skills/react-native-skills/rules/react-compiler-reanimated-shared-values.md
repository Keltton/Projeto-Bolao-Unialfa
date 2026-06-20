---
title: Use .get() e .set() para Shared Values do Reanimated (não .value)
impact: LOW
impactDescription: necessário para compatibilidade com o React Compiler
tags: reanimated, react-compiler, shared-values
---

## Use .get() e .set() para Shared Values com o React Compiler

Com o React Compiler ativado, use `.get()` e `.set()` em vez de ler ou escrever em `.value` diretamente nos shared values do Reanimated. O compiler não consegue rastrear o acesso a propriedades — métodos explícitos garantem o comportamento correto.

**Incorreto (quebra com o React Compiler):**

```tsx
import { useSharedValue } from 'react-native-reanimated'

function Counter() {
  const count = useSharedValue(0)

  const increment = () => {
    count.value = count.value + 1 // opts out of react compiler
  }

  return <Button onPress={increment} title={`Count: ${count.value}`} />
}
```

**Correto (compatível com o React Compiler):**

```tsx
import { useSharedValue } from 'react-native-reanimated'

function Counter() {
  const count = useSharedValue(0)

  const increment = () => {
    count.set(count.get() + 1)
  }

  return <Button onPress={increment} title={`Count: ${count.get()}`} />
}
```

Consulte a [documentação do Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/#react-compiler-support) para obter mais informações.
