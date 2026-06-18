---
title: Use Tipos de Item para Listas Heterogêneas
impact: HIGH
impactDescription: reciclagem eficiente, menos oscilação de layout (layout thrashing)
tags: list, performance, recycling, heterogeneous, LegendList
---

## Use Tipos de Item para Listas Heterogêneas

Quando uma lista tiver diferentes layouts de itens (mensagens, imagens, cabeçalhos, etc.), use um campo `type` em cada item e forneça `getItemType` para a lista. Isso coloca os itens em pools de reciclagem separados para que um componente de mensagem nunca seja reciclado em um componente de imagem.

**Incorreto (componente único com condicionais):**

```tsx
type Item = { id: string; text?: string; imageUrl?: string; isHeader?: boolean }

function ListItem({ item }: { item: Item }) {
  if (item.isHeader) {
    return <HeaderItem title={item.text} />
  }
  if (item.imageUrl) {
    return <ImageItem url={item.imageUrl} />
  }
  return <MessageItem text={item.text} />
}

function Feed({ items }: { items: Item[] }) {
  return (
    <LegendList
      data={items}
      renderItem={({ item }) => <ListItem item={item} />}
      recycleItems
    />
  )
}
```

**Correto (itens tipados com componentes separados):**

```tsx
type HeaderItem = { id: string; type: 'header'; title: string }
type MessageItem = { id: string; type: 'message'; text: string }
type ImageItem = { id: string; type: 'image'; url: string }
type FeedItem = HeaderItem | MessageItem | ImageItem

function Feed({ items }: { items: FeedItem[] }) {
  return (
    <LegendList
      data={items}
      keyExtractor={(item) => item.id}
      getItemType={(item) => item.type}
      renderItem={({ item }) => {
        switch (item.type) {
          case 'header':
            return <SectionHeader title={item.title} />
          case 'message':
            return <MessageRow text={item.text} />
          case 'image':
            return <ImageRow url={item.url} />
        }
      }}
      recycleItems
    />
  )
}
```

**Por que isso importa:**

- **Eficiência de reciclagem**: Itens com o mesmo tipo compartilham um pool de reciclagem
- **Sem oscilação de layout (layout thrashing)**: Um cabeçalho nunca é reciclado em uma célula de imagem
- **Segurança de tipos (type safety)**: O TypeScript consegue afunilar o tipo do item em cada branch
- **Melhor estimativa de tamanho**: Use `getEstimatedItemSize` com `itemType` para estimativas precisas por tipo

```tsx
<LegendList
  data={items}
  keyExtractor={(item) => item.id}
  getItemType={(item) => item.type}
  getEstimatedItemSize={(index, item, itemType) => {
    switch (itemType) {
      case 'header':
        return 48
      case 'message':
        return 72
      case 'image':
        return 300
      default:
        return 72
    }
  }}
  renderItem={({ item }) => {
    /* ... */
  }}
  recycleItems
/>
```

Referência:
[LegendList getItemType](https://legendapp.com/open-source/list/api/props/#getitemtype-v2)
