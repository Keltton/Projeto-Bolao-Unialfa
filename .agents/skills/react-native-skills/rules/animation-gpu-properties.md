---
title: Anime Transform e Opacity em Vez de Propriedades de Layout
impact: HIGH
impactDescription: Animações aceleradas por GPU, sem recálculo de layout
tags: animation, performance, reanimated, transform, opacity
---

## Anime Transform e Opacity em Vez de Propriedades de Layout

Evite animar `width`, `height`, `top`, `left`, `margin` ou `padding`. Elas acionam o recálculo de layout a cada frame. Em vez disso, use `transform` (scale, translate) e `opacity`, que são executados na GPU sem acionar recálculo de layout.

**Incorreto (anima height, aciona layout a cada frame):**

```tsx
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

function CollapsiblePanel({ expanded }: { expanded: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(expanded ? 200 : 0), // triggers layout on every frame
    overflow: 'hidden',
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
```

**Correto (anima scaleY, acelerado por GPU):**

```tsx
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

function CollapsiblePanel({ expanded }: { expanded: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: withTiming(expanded ? 1 : 0) },
    ],
    opacity: withTiming(expanded ? 1 : 0),
  }))

  return (
    <Animated.View style={[{ height: 200, transformOrigin: 'top' }, animatedStyle]}>
      {children}
    </Animated.View>
  )
}
```

**Correto (anima translateY para animações de slide):**

```tsx
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

function SlideIn({ visible }: { visible: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(visible ? 0 : 100) },
    ],
    opacity: withTiming(visible ? 1 : 0),
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
```

Propriedades aceleradas por GPU: `transform` (translate, scale, rotate), `opacity`. Qualquer outra coisa aciona o recálculo de layout.
