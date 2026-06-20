---
title: Use GestureDetector para Estados de Pressionamento Animados
impact: MEDIUM
impactDescription: Animações na UI thread, feedback de pressionamento mais suave
tags: animation, gestures, press, reanimated
---

## Use GestureDetector para Estados de Pressionamento Animados

Para estados de pressionamento animados (como escala ou opacidade ao pressionar), use o `GestureDetector` com o `Gesture.Tap()` e shared values em vez dos eventos `onPressIn`/`onPressOut` do `Pressable`. Os callbacks de gestos são executados na UI thread como worklets—sem viagem de ida e volta (round-trip) pela JS thread para animações de pressionamento.

**Incorreto (Pressable com callbacks na JS thread):**

```tsx
import { Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'

function AnimatedButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withTiming(0.95))}
      onPressOut={() => (scale.value = withTiming(1))}
    >
      <Animated.View style={animatedStyle}>
        <Text>Press me</Text>
      </Animated.View>
    </Pressable>
  )
}
```

**Correto (GestureDetector com worklets na UI thread):**

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'

function AnimatedButton({ onPress }: { onPress: () => void }) {
  // Store the press STATE (0 = not pressed, 1 = pressed)
  const pressed = useSharedValue(0)

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.set(withTiming(1))
    })
    .onFinalize(() => {
      pressed.set(withTiming(0))
    })
    .onEnd(() => {
      runOnJS(onPress)()
    })

  // Derive visual values from the state
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(withTiming(pressed.get()), [0, 1], [1, 0.95]) },
    ],
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={animatedStyle}>
        <Text>Press me</Text>
      </Animated.View>
    </GestureDetector>
  )
}
```

Armazene o **estado** do pressionamento (0 ou 1) e, em seguida, derive a escala via `interpolate`. Isso mantém o shared value como a fonte única da verdade (ground truth). Use o `runOnJS` para chamar funções do JS a partir de worklets. Use `.set()` e `.get()` para compatibilidade com o React Compiler.

Referência:
[Gesture Handler Tap Gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/tap-gesture)
