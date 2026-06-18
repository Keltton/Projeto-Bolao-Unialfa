---
title: Use expo-image para Imagens Otimizadas
impact: HIGH
impactDescription: eficiência de memória, cache, placeholders blurhash, carregamento progressivo
tags: images, performance, expo-image, ui
---

## Use expo-image para Imagens Otimizadas

Use `expo-image` em vez do `Image` do React Native. Ele fornece cache eficiente em memória, placeholders blurhash, carregamento progressivo e melhor performance para listas.

**Incorreto (React Native Image):**

```tsx
import { Image } from 'react-native'

function Avatar({ url }: { url: string }) {
  return <Image source={{ uri: url }} style={styles.avatar} />
}
```

**Correto (expo-image):**

```tsx
import { Image } from 'expo-image'

function Avatar({ url }: { url: string }) {
  return <Image source={{ uri: url }} style={styles.avatar} />
}
```

**Com placeholder blurhash:**

```tsx
<Image
  source={{ uri: url }}
  placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
  contentFit="cover"
  transition={200}
  style={styles.image}
/>
```

**Com prioridade e cache:**

```tsx
<Image
  source={{ uri: url }}
  priority="high"
  cachePolicy="memory-disk"
  style={styles.hero}
/>
```

**Propriedades chave (Key props):**

- `placeholder` — Blurhash ou miniatura (thumbnail) enquanto carrega
- `contentFit` — `cover`, `contain`, `fill`, `scale-down`
- `transition` — Duração do fade-in (ms)
- `priority` — `low`, `normal`, `high`
- `cachePolicy` — `memory`, `disk`, `memory-disk`, `none`
- `recyclingKey` — Chave única para reciclagem em listas

Para cross-platform (web + native), use `SolitoImage` de `solito/image`, que usa `expo-image` por baixo dos panos.

Referência: [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
