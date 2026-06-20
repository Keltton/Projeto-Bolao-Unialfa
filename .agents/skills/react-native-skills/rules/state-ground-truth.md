---
title: O Estado Deve Representar a Verdade Absoluta
impact: HIGH
impactDescription: lógica mais limpa, depuração mais fácil, única fonte da verdade
tags: state, derived-state, reanimated, hooks
---

## O Estado Deve Representar a Verdade Absoluta

Variáveis de estado — tanto o `useState` do React quanto os `shared values` do Reanimated — devem representar o estado real de algo (ex: `pressed`, `progress`, `isOpen`), não valores visuais derivados (ex: `scale`, `opacity`, `translateY`). Derive valores visuais do estado usando computação ou interpolação.

**Incorreto (armazenando a saída visual):**

```tsx
const scale = useSharedValue(1)

const tap = Gesture.Tap()
  .onBegin(() => {
    scale.set(withTiming(0.95))
  })
  .onFinalize(() => {
    scale.set(withTiming(1))
  })

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.get() }],
}))
```

**Correto (armazenando o estado, derivando o visual):**

```tsx
const pressed = useSharedValue(0) // 0 = not pressed, 1 = pressed

const tap = Gesture.Tap()
  .onBegin(() => {
    pressed.set(withTiming(1))
  })
  .onFinalize(() => {
    pressed.set(withTiming(0))
  })

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) }],
}))
```

**Por que isso importa:**

As variáveis de estado devem representar o "estado" real, não necessariamente um resultado final desejado.

1. **Única fonte da verdade** — O estado (`pressed`) descreve o que está acontecendo; os elementos visuais são derivados
2. **Mais fácil de estender** — Adicionar opacidade, rotação ou outros efeitos requer apenas mais interpolações a partir do mesmo estado
3. **Depuração** — Inspecionar `pressed = 1` é mais claro do que `scale = 0.95`
4. **Lógica reutilizável** — O mesmo valor de `pressed` pode direcionar múltiplas propriedades visuais

**Mesmo princípio para o estado do React:**

```tsx
// Incorrect: storing derived values
const [isExpanded, setIsExpanded] = useState(false)
const [height, setHeight] = useState(0)

useEffect(() => {
  setHeight(isExpanded ? 200 : 0)
}, [isExpanded])

// Correct: derive from state
const [isExpanded, setIsExpanded] = useState(false)
const height = isExpanded ? 200 : 0
```

O estado é a verdade mínima. Todo o resto é derivado.
