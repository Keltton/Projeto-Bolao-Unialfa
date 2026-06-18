---
title: Importe a partir da Pasta do Design System
impact: LOW
impactDescription: permite alterações globais e refatoração simplificada
tags: imports, architecture, design-system
---

## Importe a partir da Pasta do Design System

Exporte novamente (re-export) as dependências a partir de uma pasta do design system. O código da aplicação importa de lá, não diretamente dos pacotes. Isso permite alterações globais e uma refatoração simplificada.

**Incorreto (importações diretamente do pacote):**

```tsx
import { View, Text } from 'react-native'
import { Button } from '@ui/button'

function Profile() {
  return (
    <View>
      <Text>Hello</Text>
      <Button>Save</Button>
    </View>
  )
}
```

**Correto (importações a partir do design system):**

```tsx
// components/view.tsx
import { View as RNView } from 'react-native'

// ideal: pick the props you will actually use to control implementation
export function View(
  props: Pick<React.ComponentProps<typeof RNView>, 'style' | 'children'>
) {
  return <RNView {...props} />
}
```

```tsx
// components/text.tsx
export { Text } from 'react-native'
```

```tsx
// components/button.tsx
export { Button } from '@ui/button'
```

```tsx
import { View } from '@/components/view'
import { Text } from '@/components/text'
import { Button } from '@/components/button'

function Profile() {
  return (
    <View>
      <Text>Hello</Text>
      <Button>Save</Button>
    </View>
  )
}
```

Comece simplesmente re-exportando as dependências. Customize depois sem alterar o código da aplicação.
