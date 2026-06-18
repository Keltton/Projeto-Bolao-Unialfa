---
title: Use Compound Components em Vez de Filhos Polimórficos
impact: MEDIUM
impactDescription: composição flexível, API mais clara
tags: design-system, components, composition
---

## Use Compound Components em Vez de Filhos Polimórficos

Não crie componentes que aceitem uma string se eles não forem um nó de texto (text node). Se um componente puder receber uma string como filho, ele deve ser um componente `*Text` dedicado. Para componentes como botões, que podem ter tanto uma View (ou Pressable) juntamente com texto, use compound components, tais como `Button`, `ButtonText` e `ButtonIcon`.

**Incorreto (filhos polimórficos):**

```tsx
import { Pressable, Text } from 'react-native'

type ButtonProps = {
  children: string | React.ReactNode
  icon?: React.ReactNode
}

function Button({ children, icon }: ButtonProps) {
  return (
    <Pressable>
      {icon}
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Pressable>
  )
}

// Usage is ambiguous
<Button icon={<Icon />}>Save</Button>
<Button><CustomText>Save</CustomText></Button>
```

**Correto (compound components):**

```tsx
import { Pressable, Text } from 'react-native'

function Button({ children }: { children: React.ReactNode }) {
  return <Pressable>{children}</Pressable>
}

function ButtonText({ children }: { children: React.ReactNode }) {
  return <Text>{children}</Text>
}

function ButtonIcon({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// Usage is explicit and composable
<Button>
  <ButtonIcon><SaveIcon /></ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>

<Button>
  <ButtonText>Cancel</ButtonText>
</Button>
```
