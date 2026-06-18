---
title: Eleve os callbacks para a raiz das listas
impact: MEDIUM
impactDescription: Menos re-renders e listas mais rápidas
tags: tag1, tag2
---

## Callbacks de Performance em Listas

**Impacto: ALTO (Menos re-renders e listas mais rápidas)**

Ao passar funções de callback para os itens da lista, crie uma única instância do callback na raiz da lista. Os itens devem então chamá-la enviando um identificador exclusivo.

**Incorreto (cria um novo callback a cada renderização):**

```typescript
return (
  <LegendList
    renderItem={({ item }) => {
      // bad: creates a new callback on each render
      const onPress = () => handlePress(item.id)
      return <Item key={item.id} item={item} onPress={onPress} />
    }}
  />
)
```

**Correto (uma única instância de função passada para cada item):**

```typescript
const onPress = useCallback(() => handlePress(item.id), [handlePress, item.id])

return (
  <LegendList
    renderItem={({ item }) => (
      <Item key={item.id} item={item} onPress={onPress} />
    )}
  />
)
```

Referência: [Link para documentação ou recurso](https://example.com)
