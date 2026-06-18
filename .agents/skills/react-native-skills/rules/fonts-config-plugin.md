---
title: Carregue fontes nativamente em tempo de build
impact: LOW
impactDescription: fontes disponíveis na inicialização, sem carregamento assíncrono
tags: fonts, expo, performance, config-plugin
---

## Use o Expo Config Plugin para Carregamento de Fontes

Use o config plugin `expo-font` para embutir fontes em tempo de build em vez do `useFonts` ou `Font.loadAsync`. Fontes embutidas são muito mais eficientes.

**Incorreto (carregamento assíncrono de fonte):**

```tsx
import { useFonts } from 'expo-font'
import { Text, View } from 'react-native'

function App() {
  const [fontsLoaded] = useFonts({
    'Geist-Bold': require('./assets/fonts/Geist-Bold.otf'),
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View>
      <Text style={{ fontFamily: 'Geist-Bold' }}>Hello</Text>
    </View>
  )
}
```

**Correto (config plugin, fontes embutidas no build):**

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": ["./assets/fonts/Geist-Bold.otf"]
        }
      ]
    ]
  }
}
```

```tsx
import { Text, View } from 'react-native'

function App() {
  // No loading state needed—font is already available
  return (
    <View>
      <Text style={{ fontFamily: 'Geist-Bold' }}>Hello</Text>
    </View>
  )
}
```

Após adicionar as fontes no config plugin, execute `npx expo prebuild` e recompile o app nativo.

Referência:
[Expo Font Documentation](https://docs.expo.dev/versions/latest/sdk/font/)
