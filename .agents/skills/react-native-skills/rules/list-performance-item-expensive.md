---
title: Mantenha os Itens da Lista Leves
impact: HIGH
impactDescription: reduz o tempo de renderização para itens visíveis durante a rolagem (scroll)
tags: lists, performance, virtualization, hooks
---

## Mantenha os Itens da Lista Leves

Os itens da lista devem ser o mais leves possível para renderizar. Minimize hooks, evite queries e limite o acesso ao React Context. Listas virtualizadas renderizam muitos itens durante a rolagem (scroll)—itens custosos causam travamentos (jank).

**Incorreto (item de lista pesado):**

```tsx
function ProductRow({ id }: { id: string }) {
  // Bad: query inside list item
  const { data: product } = useQuery(['product', id], () => fetchProduct(id))
  // Bad: multiple context accesses
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)
  const cart = useContext(CartContext)
  // Bad: expensive computation
  const recommendations = useMemo(
    () => computeRecommendations(product),
    [product]
  )

  return <View>{/* ... */}</View>
}
```

**Correto (item de lista leve):**

```tsx
function ProductRow({ name, price, imageUrl }: Props) {
  // Good: receives only primitives, minimal hooks
  return (
    <View>
      <Image source={{ uri: imageUrl }} />
      <Text>{name}</Text>
      <Text>{price}</Text>
    </View>
  )
}
```

**Mova a busca de dados (data fetching) para o pai (parent):**

```tsx
// Parent fetches all data once
function ProductList() {
  const { data: products } = useQuery(['products'], fetchProducts)

  return (
    <LegendList
      data={products}
      renderItem={({ item }) => (
        <ProductRow name={item.name} price={item.price} imageUrl={item.image} />
      )}
    />
  )
}
```

**Para valores compartilhados, use seletores do Zustand em vez de Context:**

```tsx
// Incorrect: Context causes re-render when any cart value changes
function ProductRow({ id, name }: Props) {
  const { items } = useContext(CartContext)
  const inCart = items.includes(id)
  // ...
}

// Correct: Zustand selector only re-renders when this specific value changes
function ProductRow({ id, name }: Props) {
  // use Set.has (created once at the root) instead of Array.includes()
  const inCart = useCartStore((s) => s.items.has(id))
  // ...
}
```

**Diretrizes para itens de lista:**

- Sem queries ou busca de dados (data fetching)
- Sem computações custosas (mova para o componente pai ou faça memoize no nível do pai)
- Prefira seletores do Zustand em vez de React Context
- Minimize hooks useState/useEffect
- Passe valores pré-computados via props

O objetivo: os itens de lista devem ser funções simples de renderização que recebem props e retornam JSX.
