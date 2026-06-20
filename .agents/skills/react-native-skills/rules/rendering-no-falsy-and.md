---
title: Nunca Use && com Valores Potencialmente Falsy
impact: CRITICAL
impactDescription: evita quebras (crashes) em produção
tags: rendering, conditional, jsx, crash
---

## Nunca Use && com Valores Potencialmente Falsy

Nunca use `{value && <Component />}` quando `value` puder ser uma string vazia ou `0`. Esses são valores falsy, mas renderizáveis no JSX — o React Native tentará renderizá-los como texto fora de um componente `<Text>`, causando uma quebra (hard crash) em produção.

**Incorreto (quebra se count for 0 ou name for ""):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {name && <Text>{name}</Text>}
      {count && <Text>{count} items</Text>}
    </View>
  )
}
// If name="" or count=0, renders the falsy value → crash
```

**Correto (ternário com null):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {name ? <Text>{name}</Text> : null}
      {count ? <Text>{count} items</Text> : null}
    </View>
  )
}
```

**Correto (coerção booleana explícita):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {!!name && <Text>{name}</Text>}
      {!!count && <Text>{count} items</Text>}
    </View>
  )
}
```

**Melhor (retorno antecipado - early return):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  if (!name) return null

  return (
    <View>
      <Text>{name}</Text>
      {count > 0 ? <Text>{count} items</Text> : null}
    </View>
  )
}
```

Retornos antecipados (early returns) são mais claros. Ao usar condicionais inline, prefira o operador ternário ou verificações booleanas explícitas.

**Regra do Lint:** Habilite `react/jsx-no-leaked-render` do [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md) para capturar isso automaticamente.
