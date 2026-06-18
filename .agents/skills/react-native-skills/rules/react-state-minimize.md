---
title: Minimize Variáveis de Estado e Derive Valores
impact: MEDIUM
impactDescription: menos re-renders, menos inconsistência de estado (state drift)
tags: state, derived-state, hooks, optimization
---

## Minimize Variáveis de Estado e Derive Valores

Use o menor número possível de variáveis de estado. Se um valor puder ser calculado a partir de um estado ou props existentes, derive-o durante a renderização em vez de armazená-lo no estado. O estado redundante causa re-renders desnecessários e pode ficar dessincronizado.

**Incorreto (estado redundante):**

```tsx
function Cart({ items }: { items: Item[] }) {
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0))
    setItemCount(items.length)
  }, [items])

  return (
    <View>
      <Text>{itemCount} items</Text>
      <Text>Total: ${total}</Text>
    </View>
  )
}
```

**Correto (valores derivados):**

```tsx
function Cart({ items }: { items: Item[] }) {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  const itemCount = items.length

  return (
    <View>
      <Text>{itemCount} items</Text>
      <Text>Total: ${total}</Text>
    </View>
  )
}
```

**Outro exemplo:**

```tsx
// Incorrect: storing both firstName, lastName, AND fullName
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')

// Correct: derive fullName
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const fullName = `${firstName} ${lastName}`
```

O estado deve ser a fonte de verdade mínima. Todo o resto é derivado.

Referência: [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
