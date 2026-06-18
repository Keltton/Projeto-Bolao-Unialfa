---
title: Use contentInsetAdjustmentBehavior para Safe Areas
impact: MEDIUM
impactDescription: tratamento nativo de safe area, sem deslocamentos de layout
tags: safe-area, scrollview, layout
---

## Use contentInsetAdjustmentBehavior para Safe Areas

Use `contentInsetAdjustmentBehavior="automatic"` no `ScrollView` raiz em vez de envolver o conteúdo em um `SafeAreaView` ou aplicar padding manual. Isso permite que o iOS trate os insets de safe area nativamente com o comportamento de rolagem adequado.

**Incorreto (envolvendo com SafeAreaView):**

```tsx
import { SafeAreaView, ScrollView, View, Text } from 'react-native'

function MyScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <Text>Content</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
```

**Incorreto (padding manual de safe area):**

```tsx
import { ScrollView, View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function MyScreen() {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top }}>
      <View>
        <Text>Content</Text>
      </View>
    </ScrollView>
  )
}
```

**Correto (ajuste nativo de content inset):**

```tsx
import { ScrollView, View, Text } from 'react-native'

function MyScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      <View>
        <Text>Content</Text>
      </View>
    </ScrollView>
  )
}
```

A abordagem nativa lida com safe areas dinâmicas (teclado, barras de ferramentas) e permite que o conteúdo role por trás da barra de status (status bar) naturalmente.
