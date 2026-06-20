---
title: Use Galeria para Galerias de Imagens e Lightbox
impact: MEDIUM
impactDescription: transições nativas de elementos compartilhados, pinch-to-zoom, pan-to-close
tags: images, gallery, lightbox, expo-image, ui
---

## Use Galeria para Galerias de Imagens e Lightbox

Para galerias de imagens com lightbox (toque para tela cheia), use `@nandorojo/galeria`. Ele fornece transições nativas de elementos compartilhados (shared element transitions) com zoom de pinça (pinch-to-zoom), zoom com toque duplo e arrastar para fechar (pan-to-close). Funciona com qualquer componente de imagem, incluindo `expo-image`.

**Incorreto (implementação customizada com modal):**

```tsx
function ImageGallery({ urls }: { urls: string[] }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      {urls.map((url) => (
        <Pressable key={url} onPress={() => setSelected(url)}>
          <Image source={{ uri: url }} style={styles.thumbnail} />
        </Pressable>
      ))}
      <Modal visible={!!selected} onRequestClose={() => setSelected(null)}>
        <Image source={{ uri: selected! }} style={styles.fullscreen} />
      </Modal>
    </>
  )
}
```

**Correto (Galeria com expo-image):**

```tsx
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'

function ImageGallery({ urls }: { urls: string[] }) {
  return (
    <Galeria urls={urls}>
      {urls.map((url, index) => (
        <Galeria.Image index={index} key={url}>
          <Image source={{ uri: url }} style={styles.thumbnail} />
        </Galeria.Image>
      ))}
    </Galeria>
  )
}
```

**Imagem única:**

```tsx
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'

function Avatar({ url }: { url: string }) {
  return (
    <Galeria urls={[url]}>
      <Galeria.Image>
        <Image source={{ uri: url }} style={styles.avatar} />
      </Galeria.Image>
    </Galeria>
  )
}
```

**Com miniaturas de baixa resolução e tela cheia de alta resolução:**

```tsx
<Galeria urls={highResUrls}>
  {lowResUrls.map((url, index) => (
    <Galeria.Image index={index} key={url}>
      <Image source={{ uri: url }} style={styles.thumbnail} />
    </Galeria.Image>
  ))}
</Galeria>
```

**Com FlashList:**

```tsx
<Galeria urls={urls}>
  <FlashList
    data={urls}
    renderItem={({ item, index }) => (
      <Galeria.Image index={index}>
        <Image source={{ uri: item }} style={styles.thumbnail} />
      </Galeria.Image>
    )}
    numColumns={3}
    estimatedItemSize={100}
  />
</Galeria>
```

Funciona com `expo-image`, `SolitoImage`, `Image` do `react-native` ou qualquer componente de imagem.

Referência: [Galeria](https://github.com/nandorojo/galeria)
