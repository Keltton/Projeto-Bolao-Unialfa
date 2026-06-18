---
title: Use um Virtualizador de Lista para Qualquer Lista
impact: HIGH
impactDescription: memória reduzida, montagem mais rápida
tags: lists, performance, virtualization, scrollview
---

## Use um Virtualizador de Lista para Qualquer Lista

Use um virtualizador de lista como LegendList ou FlashList em vez de um ScrollView com filhos mapeados—mesmo para listas curtas. Virtualizadores renderizam apenas itens visíveis, reduzindo o uso de memória e o tempo de montagem. O ScrollView renderiza todos os filhos de uma vez (upfront), o que se torna custoso rapidamente.

**Incorreto (ScrollView renderiza todos os itens de uma vez):**

```tsx
function Feed({ items }: { items: Item[] }) {
  return (
    <ScrollView>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </ScrollView>
  )
}
// 50 items = 50 components mounted, even if only 10 visible
```

**Correto (virtualizador renderiza apenas itens visíveis):**

```tsx
import { LegendList } from '@legendapp/list'

function Feed({ items }: { items: Item[] }) {
  return (
    <LegendList
      data={items}
      // if you aren't using React Compiler, wrap these with useCallback
      renderItem={({ item }) => <ItemCard item={item} />}
      keyExtractor={(item) => item.id}
      estimatedItemSize={80}
    />
  )
}
// Only ~10-15 visible items mounted at a time
```

**Alternativa (FlashList):**

```tsx
import { FlashList } from '@shopify/flash-list'

function Feed({ items }: { items: Item[] }) {
  return (
    <FlashList
      data={items}
      // if you aren't using React Compiler, wrap these with useCallback
      renderItem={({ item }) => <ItemCard item={item} />}
      keyExtractor={(item) => item.id}
    />
  )
}
```

Os benefícios se aplicam a qualquer tela com conteúdo rolável—perfis, configurações, feeds, resultados de busca. Adote a virtualização por padrão.
