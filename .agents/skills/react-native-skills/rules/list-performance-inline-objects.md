---
title: Evite Objetos Inline no renderItem
impact: HIGH
impactDescription: evita re-renders desnecessários de itens de lista memoizados
tags: lists, performance, flatlist, virtualization, memo
---

## Evite Objetos Inline no renderItem

Não crie novos objetos dentro do `renderItem` para passar como props. Objetos inline criam novas referências a cada renderização, quebrando a memoization. Em vez disso, passe valores primitivos diretamente de `item`.

**Incorreto (objeto inline quebra a memoization):**

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <LegendList
      data={users}
      renderItem={({ item }) => (
        <UserRow
          // Bad: new object on every render
          user={{ id: item.id, name: item.name, avatar: item.avatar }}
        />
      )}
    />
  )
}
```

**Incorreto (objeto de estilo inline):**

```tsx
renderItem={({ item }) => (
  <UserRow
    name={item.name}
    // Bad: new style object on every render
    style={{ backgroundColor: item.isActive ? 'green' : 'gray' }}
  />
)}
```

**Correto (passa o item diretamente ou primitivos):**

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <LegendList
      data={users}
      renderItem={({ item }) => (
        // Good: pass the item directly
        <UserRow user={item} />
      )}
    />
  )
}
```

**Correto (passa primitivos, deriva dentro do filho):**

```tsx
renderItem={({ item }) => (
  <UserRow
    id={item.id}
    name={item.name}
    isActive={item.isActive}
  />
)}

const UserRow = memo(function UserRow({ id, name, isActive }: Props) {
  // Good: derive style inside memoized component
  const backgroundColor = isActive ? 'green' : 'gray'
  return <View style={[styles.row, { backgroundColor }]}>{/* ... */}</View>
})
```

**Correto (eleva estilos estáticos no escopo do módulo):**

```tsx
const activeStyle = { backgroundColor: 'green' }
const inactiveStyle = { backgroundColor: 'gray' }

renderItem={({ item }) => (
  <UserRow
    name={item.name}
    // Good: stable references
    style={item.isActive ? activeStyle : inactiveStyle}
  />
)}
```

Passar primitivos ou referências estáveis permite que o `memo()` pule re-renders quando os valores reais não mudaram.

**Nota:** Se você tiver o React Compiler habilitado, ele trata a memoization automaticamente e essas otimizações manuais tornam-se menos críticas.
