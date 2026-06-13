# Async e Concorrência — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Validação](../qualidade/VALIDACAO.md)** | **[Commits →](COMMITS.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define as **regras para operações assíncronas** no projeto Wl.Yaml:
`async/await`, `CancellationToken`, e padrões proibidos.

**Objetivo:** código assíncrono previsível, cancelável e livre de armadilhas
comuns (promise perdida, `void` acidental, cadeia `.then()` ilegível).

---

## Regra de Ouro

Toda operação de I/O é `async/await`. Toda operação cancelável recebe
`CancellationToken` como último parâmetro. Nunca `.then()`, nunca
`async void`.

---

## 1. `async/await` para Todo I/O

Use `async/await` para:

- Leitura/escrita de arquivos (`workspace.fs`)
- Chamadas HTTP (schemas remotos, JSON Schema Store)
- Comunicação LSP (`sendRequest`, `sendNotification`)
- Leitura de configurações quando assíncrona
- Operações do `ExtensionContext.globalState` / `workspaceState`

```typescript
// CORRETO
async obterSchemaAsync(uri: string, ct: CancellationToken): Promise<string | undefined> {
  const cached = await this._cache.obterAsync(uri, ct);
  if (cached !== undefined) {
    return cached;
  }

  const conteudo = await this._clienteHttp.buscarAsync(uri, ct);
  await this._cache.salvarAsync(uri, conteudo, ct);
  return conteudo;
}

// ERRADO — .then() encadeado
obterSchemaPromise(uri: string): Promise<string | undefined> {
  return this._cache.obterAsync(uri)
    .then(cached => {
      if (cached !== undefined) return cached;
      return this._clienteHttp.buscarAsync(uri);
    })
    .then(conteudo => {
      this._cache.salvarAsync(uri, conteudo);  // promise perdida!
      return conteudo;
    });
}
```

---

## 2. `CancellationToken` em Operações Canceláveis

Toda operação de I/O que envolve rede ou filesystem lento deve aceitar
`CancellationToken` como **último parâmetro**.

```typescript
// CORRETO — assinatura com CancellationToken
async lerArquivoAsync(uri: Uri, ct: CancellationToken): Promise<string> {
  if (ct.isCancellationRequested) {
    return '';
  }

  const bytes = await workspace.fs.readFile(uri);
  return new TextDecoder().decode(bytes);
}

// CORRETO — verificação no início de operação longa
async resolverTodosOsPerfisAsync(
  uris: readonly string[],
  ct: CancellationToken
): Promise<readonly PerfilFormatacao[]> {
  const perfis: PerfilFormatacao[] = [];

  for (const uri of uris) {
    if (ct.isCancellationRequested) {
      break;
    }
    const perfil = await this._repositorioPerfil.obterAsync(uri, ct);
    if (perfil !== undefined) {
      perfis.push(perfil);
    }
  }

  return perfis;
}
```

### Quando usar `CancellationToken.None`

Em testes unitários ou em chamadas onde não há contexto de cancelamento real
(ex.: ativação da extensão sem operação do usuário pendente).

```typescript
// Em testes
const resultado = await servico.resolverPerfilEfetivoAsync(requisicao, CancellationToken.None);

// Em ativação da extensão onde não há operação pendente
await this._servicoSchema.inicializarAsync(CancellationToken.None);
```

---

## 3. Proibições

### `async void`

`async void` cria uma promise sem possibilidade de await. Erros lançados
dentro dela são silenciosamente perdidos.

```typescript
// ERRADO — async void
async function ativarExtensao(contexto: ExtensionContext): void {
  await inicializar(contexto);  // erro aqui é perdido
}

// CORRETO — retornar Promise
async function ativarExtensao(contexto: ExtensionContext): Promise<void> {
  await inicializar(contexto);
}
```

**Exceção:** o callback `activate()` exportado da extensão deve retornar
`Promise<void>` — não `void`.

### Promise perdida (fire-and-forget sem tratamento)

```typescript
// ERRADO — promise não é aguardada nem tratada
this._cache.limparAsync();  // erro silencioso

// CORRETO — aguardar
await this._cache.limparAsync();

// CORRETO — quando fire-and-forget é intencional, tratar erro explicitamente
this._cache.limparAsync().catch(erro => {
  this._logger.appendLine(`[AVISO] Falha ao limpar cache: ${erro}`);
});
```

### `.then()` encadeado

```typescript
// ERRADO — encadeamento .then()
workspace.fs.readFile(uri)
  .then(bytes => JSON.parse(new TextDecoder().decode(bytes)))
  .then(dados => this._mapeador.paraEntidade(dados))
  .catch(erro => { throw new PerfilInvalidoExcecao(String(erro)); });

// CORRETO — await sequencial
const bytes = await workspace.fs.readFile(uri);
const dado: unknown = JSON.parse(new TextDecoder().decode(bytes));

if (!this._ehPerfilRaw(dado)) {
  throw new PerfilInvalidoExcecao('Estrutura inválida.');
}

return this._mapeador.paraEntidade(dado);
```

---

## 4. Await em Loop

Para operações assíncronas sequenciais (onde a ordem importa ou o resultado
depende da iteração anterior), use `for...of` com `await`:

```typescript
// CORRETO — sequencial com await
for (const uri of uris) {
  if (ct.isCancellationRequested) break;
  await this._clienteLsp.enviarNotificacaoAsync(uri, ct);
}
```

Para operações paralelas independentes (onde a ordem não importa), use
`Promise.all`:

```typescript
// CORRETO — paralelo independente
const perfis = await Promise.all(
  uris.map(uri => this._repositorioPerfil.obterAsync(uri, ct))
);
```

**Proibido:** `forEach` com `async` — o `forEach` não aguarda promises.

```typescript
// ERRADO — forEach ignora promises
uris.forEach(async uri => {
  await this._clienteLsp.enviarNotificacaoAsync(uri, ct);  // não é aguardado
});
```

---

## 5. Nomenclatura de Métodos Async

Todo método assíncrono deve ter o sufixo `Async`:

```typescript
// CORRETO
async resolverPerfilEfetivoAsync(...): Promise<PerfilFormatacaoResposta> {}
async obterSchemaAsync(...): Promise<string | undefined> {}
async inicializarAsync(...): Promise<void> {}

// ERRADO — sem sufixo
async resolverPerfilEfetivo(...): Promise<PerfilFormatacaoResposta> {}
```

---

## Checklist de Async

- [ ] Todo I/O usa `async/await`?
- [ ] Métodos canceláveis recebem `CancellationToken` como último parâmetro?
- [ ] Sem `async void` — retorna `Promise<void>`?
- [ ] Promises não são deixadas sem `await` ou `.catch()`?
- [ ] Sem `.then()` encadeado?
- [ ] Sem `forEach` com callback `async`?
- [ ] Métodos assíncronos têm sufixo `Async`?
- [ ] `Promise.all` para operações paralelas independentes?

---

**Próximo:** [Commits →](COMMITS.md)
