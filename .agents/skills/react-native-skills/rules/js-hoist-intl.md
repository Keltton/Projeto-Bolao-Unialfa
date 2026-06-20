---
title: Eleve a Criação de Formatadores Intl (Hoist)
impact: LOW-MEDIUM
impactDescription: evita a recriação custosa de objetos
tags: javascript, intl, optimization, memoization
---

## Eleve a Criação de Formatadores Intl (Hoist)

Não crie `Intl.DateTimeFormat`, `Intl.NumberFormat` ou `Intl.RelativeTimeFormat` dentro do render ou em loops. Eles têm um custo de instanciação elevado. Eleve-os (hoist) para o escopo do módulo quando o locale/options forem estáticos.

**Incorreto (novo formatador a cada renderização):**

```tsx
function Price({ amount }: { amount: number }) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return <Text>{formatter.format(amount)}</Text>
}
```

**Correto (elevado para o escopo do módulo):**

```tsx
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function Price({ amount }: { amount: number }) {
  return <Text>{currencyFormatter.format(amount)}</Text>
}
```

**Para locales dinâmicos, faça memoize:**

```tsx
const dateFormatter = useMemo(
  () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
  [locale]
)
```

**Formatadores comuns para elevar (hoist):**

```tsx
// Module-level formatters
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })
const timeFormatter = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' })
const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent' })
const relativeFormatter = new Intl.RelativeTimeFormat('en-US', {
  numeric: 'auto',
})
```

Criar objetos `Intl` é significativamente mais caro do que `RegExp` ou objetos simples—cada instanciação faz o parse de dados de localidade (locale) e constrói tabelas internas de busca (lookup tables).
