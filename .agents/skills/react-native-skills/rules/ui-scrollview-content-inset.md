---
title: Use contentInset para Espaçamento Dinâmico em ScrollView
impact: LOW
impactDescription: atualizações mais fluidas, sem recálculo de layout
tags: scrollview, layout, contentInset, performance
---

## Use contentInset para Espaçamento Dinâmico em ScrollView

Ao adicionar espaço no topo ou na parte inferior de uma `ScrollView` que pode mudar (teclado, barras de ferramentas, conteúdo dinâmico), use `contentInset` em vez de padding. Mudar o `contentInset` não dispara o recálculo do layout — ele apenas ajusta a área de rolagem sem re-renderizar o conteúdo.

**Incorreto (padding causa recálculo de layout):**

```tsx
function Feed({ bottomOffset }: { bottomOffset: number }) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: bottomOffset }}>
      {children}
    </ScrollView>
  )
}
// Changing bottomOffset triggers full layout recalculation
```

**Correto (contentInset para espaçamento dinâmico):**

```tsx
function Feed({ bottomOffset }: { bottomOffset: number }) {
  return (
    <ScrollView
      contentInset={{ bottom: bottomOffset }}
      scrollIndicatorInsets={{ bottom: bottomOffset }}
    >
      {children}
    </ScrollView>
  )
}
// Changing bottomOffset only adjusts scroll bounds
```

Use `scrollIndicatorInsets` junto com `contentInset` para manter o indicador de rolagem (scroll indicator) alinhado. Para espaçamentos estáticos que nunca mudam, o uso de padding é perfeitamente adequado.
