---
title: Use Modais Nativos em Vez de Bottom Sheets Baseados em JS
impact: HIGH
impactDescription: performance nativa, gestos, acessibilidade
tags: modals, bottom-sheet, native, react-navigation
---

## Use Modais Nativos em Vez de Bottom Sheets Baseados em JS

Use o `<Modal>` nativo com `presentationStyle="formSheet"` ou o form sheet nativo do React Navigation v7 em vez de bibliotecas de bottom sheet baseadas em JS. Os modais nativos possuem gestos embutidos, acessibilidade e melhor performance. Conte com a UI nativa para primitivos de baixo nível.

**Incorreto (bottom sheet baseado em JS):**

```tsx
import BottomSheet from 'custom-js-bottom-sheet'

function MyScreen() {
  const sheetRef = useRef<BottomSheet>(null)

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={() => sheetRef.current?.expand()} title='Open' />
      <BottomSheet ref={sheetRef} snapPoints={['50%', '90%']}>
        <View>
          <Text>Sheet content</Text>
        </View>
      </BottomSheet>
    </View>
  )
}
```

**Correto (Modal nativo com formSheet):**

```tsx
import { Modal, View, Text, Button } from 'react-native'

function MyScreen() {
  const [visible, setVisible] = useState(false)

  return (
    <View style={{ flex: 1 }}>
      <Button onPress={() => setVisible(true)} title='Open' />
      <Modal
        visible={visible}
        presentationStyle='formSheet'
        animationType='slide'
        onRequestClose={() => setVisible(false)}
      >
        <View>
          <Text>Sheet content</Text>
        </View>
      </Modal>
    </View>
  )
}
```

**Correto (form sheet nativo do React Navigation v7):**

```tsx
// In your navigator
<Stack.Screen
  name='Details'
  component={DetailsScreen}
  options={{
    presentation: 'formSheet',
    sheetAllowedDetents: 'fitToContents',
  }}
/>
```

Modais nativos oferecem suporte a deslizar para fechar (swipe-to-dismiss), tratamento adequado para evitar o teclado (keyboard avoidance) e acessibilidade prontos para uso (out of the box).
