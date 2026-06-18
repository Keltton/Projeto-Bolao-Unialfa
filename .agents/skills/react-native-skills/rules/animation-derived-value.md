---
title: Prefira useDerivedValue em Vez de useAnimatedReaction
impact: MEDIUM
impactDescription: código mais limpo, rastreamento automático de dependências
tags: animation, reanimated, derived-value
---

## Prefira useDerivedValue em Vez de useAnimatedReaction

Ao derivar um shared value a partir de outro, use o `useDerivedValue` em vez do `useAnimatedReaction`. Os valores derivados são declarativos, rastreiam automaticamente as dependências e retornam um valor que você pode usar diretamente. Animated reactions servem para efeitos colaterais (side effects), não para derivações.

**Incorreto (useAnimatedReaction para derivação):**

```tsx
import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated'

function MyComponent() {
  const progress = useSharedValue(0)
  const opacity = useSharedValue(1)

  useAnimatedReaction(
    () => progress.value,
    (current) => {
      opacity.value = 1 - current
    }
  )

  // ...
}
```

**Correto (useDerivedValue):**

```tsx
import { useSharedValue, useDerivedValue } from 'react-native-reanimated'

function MyComponent() {
  const progress = useSharedValue(0)

  const opacity = useDerivedValue(() => 1 - progress.get())

  // ...
}
```

Use `useAnimatedReaction` apenas para efeitos colaterais (side effects) que não produzem um valor (ex: acionar feedback tátil (haptics), logging, chamar `runOnJS`).

Referência:
[Reanimated useDerivedValue](https://docs.swmansion.com/react-native-reanimated/docs/core/useDerivedValue)
