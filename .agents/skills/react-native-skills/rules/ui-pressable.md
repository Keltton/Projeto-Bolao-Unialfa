---
title: Use Pressable em Vez de Componentes Touchable
impact: LOW
impactDescription: API moderna, mais flexível
tags: ui, pressable, touchable, gestures
---

## Use Pressable em Vez de Componentes Touchable

Nunca use `TouchableOpacity` ou `TouchableHighlight`. Em vez disso, use `Pressable` do `react-native` ou do `react-native-gesture-handler`.

**Incorreto (componentes Touchable legados):**

```tsx
import { TouchableOpacity } from 'react-native'

function MyButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text>Press me</Text>
    </TouchableOpacity>
  )
}
```

**Correto (Pressable):**

```tsx
import { Pressable } from 'react-native'

function MyButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text>Press me</Text>
    </Pressable>
  )
}
```

**Correto (Pressable do gesture handler para listas):**

```tsx
import { Pressable } from 'react-native-gesture-handler'

function ListItem({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Text>Item</Text>
    </Pressable>
  )
}
```

Use o `Pressable` do `react-native-gesture-handler` dentro de listas roláveis (scrollable lists) para obter uma melhor coordenação de gestos, desde que você também esteja usando o `ScrollView` do `react-native-gesture-handler`.

**Para estados de clique animados (mudanças de escala e opacidade):** Use `GestureDetector` com shared values do Reanimated em vez do callback de estilo do Pressable. Consulte a regra `animation-gesture-detector-press`.
