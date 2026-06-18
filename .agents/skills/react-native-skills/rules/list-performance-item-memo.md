---
title: Passe Primitivos para Itens de Lista para Memoization
impact: HIGH
impactDescription: possibilita comparação efetiva com memo()
tags: lists, performance, memo, primitives
---

## Passe Primitivos para Itens de Lista para Memoization

Sempre que possível, passe apenas valores primitivos (strings, numbers, booleans) como props para componentes de itens de lista. Os primitivos permitem que a comparação rasa (shallow comparison) no `memo()` funcione corretamente, ignorando re-renders quando os valores não tiverem mudado.

**Incorreto (prop de objeto exige comparação profunda):**

```tsx
type User = { id: string; name: string; email: string; avatar: string }

const UserRow = memo(function UserRow({ user }: { user: User }) {
  // memo() compares user by reference, not value
  // If parent creates new user object, this re-renders even if data is same
  return <Text>{user.name}</Text>
})

renderItem={({ item }) => <UserRow user={item} />}
```

Isso ainda pode ser otimizado, mas é mais difícil de fazer o memoize corretamente.

**Correto (props primitivas permitem comparação rasa):**

```tsx
const UserRow = memo(function UserRow({
  id,
  name,
  email,
}: {
  id: string
  name: string
  email: string
}) {
  // memo() compares each primitive directly
  // Re-renders only if id, name, or email actually changed
  return <Text>{name}</Text>
})

renderItem={({ item }) => (
  <UserRow id={item.id} name={item.name} email={item.email} />
)}
```

**Passe apenas o que você precisa:**

```tsx
// Incorrect: passing entire item when you only need name
<UserRow user={item} />

// Correct: pass only the fields the component uses
<UserRow name={item.name} avatarUrl={item.avatar} />
```

**Para callbacks, eleve-os (hoist) ou use o ID do item:**

```tsx
// Incorrect: inline function creates new reference
<UserRow name={item.name} onPress={() => handlePress(item.id)} />

// Correct: pass ID, handle in child
<UserRow id={item.id} name={item.name} />

const UserRow = memo(function UserRow({ id, name }: Props) {
  const handlePress = useCallback(() => {
    // use id here
  }, [id])
  return <Pressable onPress={handlePress}><Text>{name}</Text></Pressable>
})
```

Props primitivas tornam a memoization previsível e eficaz.

**Nota:** Se você tiver o React Compiler habilitado, não precisará usar `memo()` ou `useCallback()`, mas as referências de objeto ainda se aplicam.
