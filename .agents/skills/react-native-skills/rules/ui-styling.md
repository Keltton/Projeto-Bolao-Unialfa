---
title: Padrões Modernos de Estilização em React Native
impact: MEDIUM
impactDescription: design consistente, bordas mais suaves, layouts mais limpos
tags: styling, css, layout, shadows, gradients
---

## Padrões Modernos de Estilização em React Native

Siga estes padrões de estilização para obter um código React Native mais limpo e consistente.

**Sempre use `borderCurve: 'continuous'` com `borderRadius`:**

```tsx
// Incorrect
{ borderRadius: 12 }

// Correct – smoother iOS-style corners
{ borderRadius: 12, borderCurve: 'continuous' }
```

**Use `gap` em vez de margin para espaçamento entre elementos:**

```tsx
// Incorrect – margin on children
<View>
  <Text style={{ marginBottom: 8 }}>Title</Text>
  <Text style={{ marginBottom: 8 }}>Subtitle</Text>
</View>

// Correct – gap on parent
<View style={{ gap: 8 }}>
  <Text>Title</Text>
  <Text>Subtitle</Text>
</View>
```

**Use `padding` para espaço interno, e `gap` para espaço entre elementos:**

```tsx
<View style={{ padding: 16, gap: 12 }}>
  <Text>First</Text>
  <Text>Second</Text>
</View>
```

**Use `experimental_backgroundImage` para gradientes lineares (linear gradients):**

```tsx
// Incorrect – third-party gradient library
<LinearGradient colors={['#000', '#fff']} />

// Correct – native CSS gradient syntax
<View
  style={{
    experimental_backgroundImage: 'linear-gradient(to bottom, #000, #fff)',
  }}
/>
```

**Use a sintaxe de string CSS `boxShadow` para sombras:**

```tsx
// Incorrect – legacy shadow objects or elevation
{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 }
{ elevation: 4 }

// Correct – CSS box-shadow syntax
{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }
```

**Evite múltiplos tamanhos de fonte — use peso (weight) e cor para dar ênfase:**

```tsx
// Incorrect – varying font sizes for hierarchy
<Text style={{ fontSize: 18 }}>Title</Text>
<Text style={{ fontSize: 14 }}>Subtitle</Text>
<Text style={{ fontSize: 12 }}>Caption</Text>

// Correct – consistent size, vary weight and color
<Text style={{ fontWeight: '600' }}>Title</Text>
<Text style={{ color: '#666' }}>Subtitle</Text>
<Text style={{ color: '#999' }}>Caption</Text>
```

Limitar os tamanhos de fonte cria consistência visual. Use `fontWeight` (bold/semibold) e cores em tons de cinza (grayscale) para estabelecer a hierarquia visual.
