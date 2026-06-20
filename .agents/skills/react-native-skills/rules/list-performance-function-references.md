---
title: Otimize a Performance de Listas com Referências Estáveis de Objetos
impact: CRITICAL
impactDescription: a virtualização depende da estabilidade de referências
tags: lists, performance, flatlist, virtualization
---

## Otimize a Performance de Listas com Referências Estáveis de Objetos

Não aplique map ou filter nos dados antes de passá-los para listas virtualizadas. A virtualização depende da estabilidade das referências de objetos para saber o que mudou—novas referências causam re-renders completos de todos os itens visíveis. Tente evitar renderizações frequentes no nível do componente pai da lista.

Sempre que necessário, use seletores de contexto (context selectors) dentro dos itens de lista.

**Incorreto (cria novas referências de objetos a cada tecla digitada):**

```tsx
function DomainSearch() {
  const { keyword, setKeyword } = useKeywordZustandState()
  const { data: tlds } = useTlds()

  // Bad: creates new objects on every render, reparenting the entire list on every keystroke
  const domains = tlds.map((tld) => ({
    domain: `${keyword}.${tld.name}`,
    tld: tld.name,
    price: tld.price,
  }))

  return (
    <>
      <TextInput value={keyword} onChangeText={setKeyword} />
      <LegendList
        data={domains}
        renderItem={({ item }) => <DomainItem item={item} keyword={keyword} />}
      />
    </>
  )
}
```

**Correto (referências estáveis, transformação dentro dos itens):**

```tsx
const renderItem = ({ item }) => <DomainItem tld={item} />

function DomainSearch() {
  const { data: tlds } = useTlds()

  return (
    <LegendList
      // good: as long as the data is stable, LegendList will not re-render the entire list
      data={tlds}
      renderItem={renderItem}
    />
  )
}

function DomainItem({ tld }: { tld: Tld }) {
  // good: transform within items, and don't pass the dynamic data as a prop
  // good: use a selector function from zustand to receive a stable string back
  const domain = useKeywordZustandState((s) => s.keyword + '.' + tld.name)
  return <Text>{domain}</Text>
}
```

**Atualizando a referência do array pai:**

```tsx
// good: creates a new array instance without mutating the inner objects
// good: parent array reference is unaffected by typing and updating "keyword"
const sortedTlds = tlds.toSorted((a, b) => a.name.localeCompare(b.name))

return <LegendList data={sortedTlds} renderItem={renderItem} />
```

Criar uma nova instância de array pode não ser um problema, desde que as referências dos seus objetos internos sejam estáveis. Por exemplo, se você ordenar uma lista de objetos:

Mesmo que isso crie uma nova instância de array `sortedTlds`, as referências dos objetos internos permanecem estáveis.

**Com o Zustand para dados dinâmicos (evita re-renders do componente pai):**

```tsx
const useSearchStore = create<{ keyword: string }>(() => ({ keyword: '' }))

function DomainSearch() {
  const { data: tlds } = useTlds()

  return (
    <>
      <SearchInput />
      <LegendList
        data={tlds}
        // if you aren't using React Compiler, wrap renderItem with useCallback
        renderItem={({ item }) => <DomainItem tld={item} />}
      />
    </>
  )
}

function DomainItem({ tld }: { tld: Tld }) {
  // Select only what you need—component only re-renders when keyword changes
  const keyword = useSearchStore((s) => s.keyword)
  const domain = `${keyword}.${tld.name}`
  return <Text>{domain}</Text>
}
```

A virtualização agora pode pular itens que não mudaram ao digitar. Apenas os itens visíveis (~20) sofrem re-render a cada tecla digitada, em vez de re-renderizar todo o componente pai.

**Derivando estado dentro de itens de lista com base em dados do pai (evita re-renders do componente pai):**

Para componentes em que os dados dependem de condições do estado do componente pai, este padrão é ainda mais importante. Por exemplo, se você estiver verificando se um item é favoritado, alternar os favoritos apenas fará re-render em um único componente se o próprio item for responsável por acessar o estado, em vez do pai:

```tsx
function DomainItemFavoriteButton({ tld }: { tld: Tld }) {
  const isFavorited = useFavoritesStore((s) => s.favorites.has(tld.id))
  return <TldFavoriteButton isFavorited={isFavorited} />
}
```

Nota: Se você estiver usando o React Compiler, poderá ler os valores do React Context diretamente dentro dos itens de lista. Embora isso seja um pouco mais lento do que usar um seletor do Zustand na maioria dos casos, o efeito pode ser insignificante.
