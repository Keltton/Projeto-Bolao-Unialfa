---
title: Desestruture Funções Cedo na Renderização (React Compiler)
impact: HIGH
impactDescription: referências estáveis, menos re-renders
tags: rerender, hooks, performance, react-compiler
---

## Desestruture Funções Cedo na Renderização

Esta regra aplica-se apenas se você estiver utilizando o React Compiler.

Desestruture funções de hooks no topo do escopo de renderização. Nunca acesse propriedades de objetos por ponto para chamar funções. Funções desestruturadas são referências estáveis; o acesso por ponto cria novas referências e quebra a memoização.

**Incorreto (acesso por ponto no objeto):**

```tsx
import { useRouter } from 'expo-router'

function SaveButton(props) {
  const router = useRouter()

  // bad: react-compiler will key the cache on "props" and "router", which are objects that change each render
  const handlePress = () => {
    props.onSave()
    router.push('/success') // unstable reference
  }

  return <Button onPress={handlePress}>Save</Button>
}
```

**Correto (desestruturação antecipada):**

```tsx
import { useRouter } from 'expo-router'

function SaveButton({ onSave }) {
  const { push } = useRouter()

  // good: react-compiler will key on push and onSave
  const handlePress = () => {
    onSave()
    push('/success') // stable reference
  }

  return <Button onPress={handlePress}>Save</Button>
}
```
