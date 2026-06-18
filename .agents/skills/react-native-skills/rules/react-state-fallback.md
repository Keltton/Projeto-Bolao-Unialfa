---
title: Use Estado de Fallback em vez de initialState
impact: MEDIUM
impactDescription: fallbacks reativos sem necessidade de sincronização
tags: state, hooks, derived-state, props, initialState
---

## Use Estado de Fallback em vez de initialState

Use `undefined` como estado inicial e coalescência nula (`??`) para recorrer (fallback) a valores do componente pai ou do servidor. O estado representa apenas a intenção do usuário — `undefined` significa "o usuário ainda não escolheu". Isso possibilita fallbacks reativos que se atualizam quando a origem muda, e não apenas na renderização inicial.

**Incorreto (sincroniza o estado, perde a reatividade):**

```tsx
type Props = { fallbackEnabled: boolean }

function Toggle({ fallbackEnabled }: Props) {
  const [enabled, setEnabled] = useState(defaultEnabled)
  // If fallbackEnabled changes, state is stale
  // State mixes user intent with default value

  return <Switch value={enabled} onValueChange={setEnabled} />
}
```

**Correto (o estado é a intenção do usuário, fallback reativo):**

```tsx
type Props = { fallbackEnabled: boolean }

function Toggle({ fallbackEnabled }: Props) {
  const [_enabled, setEnabled] = useState<boolean | undefined>(undefined)
  const enabled = _enabled ?? defaultEnabled
  // undefined = user hasn't touched it, falls back to prop
  // If defaultEnabled changes, component reflects it
  // Once user interacts, their choice persists

  return <Switch value={enabled} onValueChange={setEnabled} />
}
```

**Com dados do servidor:**

```tsx
function ProfileForm({ data }: { data: User }) {
  const [_theme, setTheme] = useState<string | undefined>(undefined)
  const theme = _theme ?? data.theme
  // Shows server value until user overrides
  // Server refetch updates the fallback automatically

  return <ThemePicker value={theme} onChange={setTheme} />
}
```
