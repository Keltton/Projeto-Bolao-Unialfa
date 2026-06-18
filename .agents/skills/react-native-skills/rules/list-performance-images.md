---
title: Use Imagens Compactadas em Listas
impact: HIGH
impactDescription: tempos de carregamento mais rápidos, menor uso de memória
tags: lists, images, performance, optimization
---

## Use Imagens Compactadas em Listas

Sempre carregue imagens compactadas e com dimensões apropriadas em listas. Imagens em resolução máxima (full-resolution) consomem memória excessiva e causam travamentos na rolagem (scroll jank). Solicite thumbnails ao seu servidor ou use uma CDN de imagens com parâmetros de redimensionamento.

**Incorreto (imagens em resolução máxima):**

```tsx
function ProductItem({ product }: { product: Product }) {
  return (
    <View>
      {/* 4000x3000 image loaded for a 100x100 thumbnail */}
      <Image
        source={{ uri: product.imageUrl }}
        style={{ width: 100, height: 100 }}
      />
      <Text>{product.name}</Text>
    </View>
  )
}
```

**Correto (solicitação de imagem em tamanho adequado):**

```tsx
function ProductItem({ product }: { product: Product }) {
  // Request a 200x200 image (2x for retina)
  const thumbnailUrl = `${product.imageUrl}?w=200&h=200&fit=cover`

  return (
    <View>
      <Image
        source={{ uri: thumbnailUrl }}
        style={{ width: 100, height: 100 }}
        contentFit='cover'
      />
      <Text>{product.name}</Text>
    </View>
  )
}
```

Use um componente de imagem otimizado com caching embutido e suporte a placeholders, como o `expo-image` ou `SolitoImage` (que usa `expo-image` por baixo dos panos). Solicite imagens com o dobro (2x) do tamanho de exibição para telas retina.
