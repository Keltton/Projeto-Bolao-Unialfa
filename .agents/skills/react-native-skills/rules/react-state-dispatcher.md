---
title: Use Updaters no Dispatch de useState para Estado que Depende do Valor Atual
impact: MEDIUM
impactDescription: evita closures obsoletas (stale closures), previne re-renders desnecessários
tags: state, hooks, useState, callbacks
---

## Use Updaters no Dispatch de useState para Estado que Depende do Valor Atual

Quando o próximo estado depender do estado atual, use uma função de atualização (dispatch updater - `setState(prev => ...)`) em vez de ler a variável de estado diretamente dentro de um callback. Isso evita closures obsoletas (stale closures) e garante que você esteja comparando com o valor mais recente.

**Incorreto (lê o estado diretamente):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  // size may be stale in this closure
  if (size?.width !== width || size?.height !== height) {
    setSize({ width, height })
  }
}
```

**Correto (função de atualização):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  setSize((prev) => {
    if (prev?.width === width && prev?.height === height) return prev
    return { width, height }
  })
}
```

Retornar o valor anterior da função de atualização ignora o re-render.

Para estados primitivos, você não precisa comparar os valores antes de disparar um re-render.

**Incorreto (comparação desnecessária para estado primitivo):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  setSize((prev) => (prev === width ? prev : width))
}
```

**Correto (define o estado primitivo diretamente):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  setSize(width)
}
```

No entanto, se o próximo estado depender do estado atual, você ainda deve usar uma função de atualização.

**Incorreto (lê o estado diretamente do callback):**

```tsx
const [count, setCount] = useState(0)

const onTap = () => {
  setCount(count + 1)
}
```

**Correto (função de atualização):**

```tsx
const [count, setCount] = useState(0)

const onTap = () => {
  setCount((prev) => prev + 1)
}
```
