---
title: Use Navegadores Nativos para Navegação
impact: HIGH
impactDescription: performance nativa, interface de usuário adequada para cada plataforma
tags: navigation, react-navigation, expo-router, native-stack, tabs
---

## Use Navegadores Nativos para Navegação

Sempre use navegadores nativos em vez daqueles baseados em JavaScript. Navegadores nativos utilizam APIs de plataforma (UINavigationController no iOS, Fragment no Android) para obter melhor performance e comportamento nativo.

**Para stacks:** Use `@react-navigation/native-stack` ou a stack padrão do expo-router (que usa native-stack). Evite `@react-navigation/stack`.

**Para tabs:** Use `react-native-bottom-tabs` (nativo) ou as abas nativas do expo-router. Evite `@react-navigation/bottom-tabs` quando a sensação nativa (native feel) for importante.

### Navegação Stack

**Incorreto (JS stack navigator):**

```tsx
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Details' component={DetailsScreen} />
    </Stack.Navigator>
  )
}
```

**Correto (native stack com react-navigation):**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Details' component={DetailsScreen} />
    </Stack.Navigator>
  )
}
```

**Correto (expo-router usa native stack por padrão):**

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'

export default function Layout() {
  return <Stack />
}
```

### Navegação Tab

**Incorreto (JS bottom tabs):**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Settings' component={SettingsScreen} />
    </Tab.Navigator>
  )
}
```

**Correto (native bottom tabs com react-navigation):**

```tsx
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation'

const Tab = createNativeBottomTabNavigator()

function App() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'house' }),
        }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          tabBarIcon: () => ({ sfSymbol: 'gear' }),
        }}
      />
    </Tab.Navigator>
  )
}
```

**Correto (abas nativas do expo-router):**

```tsx
// app/(tabs)/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs'

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name='index'>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf='house.fill' md='home' />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='settings'>
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf='gear' md='settings' />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
```

No iOS, as abas nativas ativam automaticamente o `contentInsetAdjustmentBehavior` no primeiro `ScrollView` na raiz de cada tela de aba, permitindo que o conteúdo role corretamente atrás da barra de abas translúcida. Se precisar desativar isso, use `disableAutomaticContentInsets` no trigger.

### Prefira Opções de Cabeçalho Nativo em vez de Componentes Customizados

**Incorreto (componente de cabeçalho customizado):**

```tsx
<Stack.Screen
  name='Profile'
  component={ProfileScreen}
  options={{
    header: () => <CustomHeader title='Profile' />,
  }}
/>
```

**Correto (opções de cabeçalho nativo):**

```tsx
<Stack.Screen
  name='Profile'
  component={ProfileScreen}
  options={{
    title: 'Profile',
    headerLargeTitleEnabled: true,
    headerSearchBarOptions: {
      placeholder: 'Search',
    },
  }}
/>
```

Cabeçalhos nativos oferecem suporte a títulos grandes (large titles) no iOS, barras de busca, efeitos de desfoque (blur) e tratamento adequado de safe area automaticamente.

### Por que Navegadores Nativos

- **Performance**: Transições e gestos nativos são executados na UI thread
- **Comportamento da plataforma**: Títulos grandes automáticos no iOS, Material Design no Android
- **Integração com o sistema**: Rolar até o topo ao tocar na aba, prevenção de Picture-in-Picture (PiP), áreas seguras (safe areas) corretas
- **Acessibilidade**: Os recursos de acessibilidade da plataforma funcionam automaticamente

Referência:

- [React Navigation Native Stack](https://reactnavigation.org/docs/native-stack-navigator)
- [React Native Bottom Tabs with React Navigation](https://oss.callstack.com/react-native-bottom-tabs/docs/guides/usage-with-react-navigation)
- [React Native Bottom Tabs with Expo Router](https://oss.callstack.com/react-native-bottom-tabs/docs/guides/usage-with-expo-router)
- [Expo Router Native Tabs](https://docs.expo.dev/router/advanced/native-tabs)
