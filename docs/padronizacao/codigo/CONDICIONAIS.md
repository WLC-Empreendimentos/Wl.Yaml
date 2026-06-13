# Condicionais e Fluxo de Controle — Wl.Yaml

> **[← Voltar ao Índice](../../PADRONIZACAO_INDEX.md)** |
> **[← Decisões](../fundamentos/DECISOES.md)** | **[Nomenclatura →](NOMENCLATURA.md)**

---

> **Nota sobre exemplos:** os trechos de código e estrutura neste documento são exclusivamente ilustrativos. A regra normativa é o texto conceitual. Exemplos demonstram o escopo deste documento e podem divergir dos exemplos de outros documentos — isso é esperado e correto.

---

## Sobre Este Documento

Define a **hierarquia obrigatória** para escolha de estruturas condicionais
no projeto Wl.Yaml.

**Objetivo:** reduzir complexidade ciclomática, padronizar decisões de fluxo e
maximizar legibilidade em revisão de código.

---

## Regra de Ouro

`if` é sintoma de modelagem incompleta.

Antes de consultar a hierarquia abaixo, faça a pergunta zero:

> **"Esta variação de comportamento merece um arquivo próprio?"**

Na maioria dos casos em que um `if` parece necessário, o que está acontecendo
é que existe uma classe ainda não criada. Extrair essa responsabilidade para
seu próprio arquivo elimina o `if` — a decisão passa a estar codificada no
sistema de tipos, não no fluxo.

```text
// Antes — if mascarando variação de comportamento
async resolverPerfilAsync(uri: string): Promise<PerfilFormatacao> {
  if (uri.includes('/k8s/')) {
    return this._resolverPerfilKubernetes(uri);
  }
  return this._resolverPerfilPadrao(uri);
}

// Depois — variação codificada em tipos, if desaparece
// IResolvedorPerfil.ts
interface IResolvedorPerfil {
  corresponde(uri: string): boolean;
  resolver(uri: string): PerfilFormatacao;
}

// ResolvedorPerfilKubernetes.ts
class ResolvedorPerfilKubernetes implements IResolvedorPerfil {
  corresponde(uri: string): boolean { return uri.includes('/k8s/'); }
  resolver(uri: string): PerfilFormatacao { ... }
}

// ResolvedorPerfilPadrao.ts
class ResolvedorPerfilPadrao implements IResolvedorPerfil {
  corresponde(_uri: string): boolean { return true; }
  resolver(uri: string): PerfilFormatacao { ... }
}

// ServicoFormatacao.ts — sem if, sem switch
async resolverPerfilAsync(uri: string): Promise<PerfilFormatacao> {
  const resolvedor = this._resolvedores.find(r => r.corresponde(uri))
    ?? this._resolvedorPadrao;
  return resolvedor.resolver(uri);
}
```

Se depois da pergunta zero a resposta for "não, não justifica um arquivo", aí
sim consulte a hierarquia abaixo. `if` aparece no nível 9 — não porque seja
inválido, mas porque quase nunca é necessário quando a modelagem é feita
corretamente.

---

## Hierarquia de Preferência — 9 Níveis

1. **Objeto de mapeamento** — chave → resultado com exaustividade implícita.
2. **`switch` exaustivo** — discriminante com todos os casos cobertos.
3. **Estratégia / Polimorfismo** — variação comportamental por implementação.
4. **Map lookup** — chave dinâmica para ação extensível.
5. **Operador Ternário** — condição curta com dois resultados simples.
6. **Nullish Coalescing (`??`)** — fallback para `null`/`undefined`.
7. **Optional Chaining (`?.`)** — navegação segura sem cadeia de `if != null`.
8. **Guard Clauses (early return)** — validação de pré-condição no início do método.
9. **`if`** — ⚠ sinal de alerta. Reavalie os 8 níveis anteriores antes de usar.

---

## 1. Objeto de Mapeamento

### Quando usar

- Mapeamento enum/código → resultado fixo.
- Regras com retorno direto por caso.
- Cenários onde cobertura de casos é crítica.

```typescript
// CORRETO — mapeamento declarativo
const INDENTACAO_POR_TIPO: Record<TipoArquivoConhecido, number> = {
  [TipoArquivoConhecido.Kubernetes]: 2,
  [TipoArquivoConhecido.DockerCompose]: 2,
  [TipoArquivoConhecido.GitHubActions]: 2,
  [TipoArquivoConhecido.Generico]: 4,
};

const indentacao: number = INDENTACAO_POR_TIPO[tipo];

// ERRADO — if/else para mapeamento fixo
let indentacao: number;
if (tipo === TipoArquivoConhecido.Kubernetes) {
  indentacao = 2;
} else if (tipo === TipoArquivoConhecido.DockerCompose) {
  indentacao = 2;
} else {
  indentacao = 4;
}
```

---

## 2. `switch` Exaustivo

### Quando usar

- Discriminante de union type ou enum onde exaustividade é verificável.
- Cada caso exige lógica maior que uma expressão simples.

```typescript
// CORRETO — switch exaustivo com never no default
function resolverModoQuebra(modo: ModoQuebra): string {
  switch (modo) {
    case ModoQuebra.Preservar: return 'preserve';
    case ModoQuebra.Nunca:     return 'never';
    case ModoQuebra.Sempre:    return 'always';
    default: {
      const _exaustivo: never = modo;
      throw new ConfiguracaoInvalidaExcecao(`ModoQuebra desconhecido: ${_exaustivo}`);
    }
  }
}

// ERRADO — if/else para discriminante com casos fixos
function resolverModoQuebraIf(modo: ModoQuebra): string {
  if (modo === ModoQuebra.Preservar) return 'preserve';
  if (modo === ModoQuebra.Nunca)     return 'never';
  return 'always';
}
```

---

## 3. Estratégia / Polimorfismo

### Quando usar

- Cada variante tem lógica própria e não apenas retorno simples.
- Lista de implementações tende a crescer.
- Objetivo é crescer por adição de classe, não por novo `if/switch` central.

```typescript
// CORRETO — variação por implementação
export interface IAvaliadorConflito {
  readonly idExtensao: string;
  ehConflitante(extensaoInstalada: Extension<unknown>): boolean;
}

export class AvaliadorConflitoDiretoDependente implements IAvaliadorConflito {
  readonly idExtensao: string;

  constructor(idExtensao: string) {
    this.idExtensao = idExtensao;
  }

  ehConflitante(extensao: Extension<unknown>): boolean {
    return extensao.id === this.idExtensao;
  }
}

export class ServicoDeteccaoConflito {
  private readonly _avaliadores: readonly IAvaliadorConflito[];

  constructor(avaliadores: readonly IAvaliadorConflito[]) {
    this._avaliadores = avaliadores;
  }

  detectarConflitos(extensoesInstaladas: readonly Extension<unknown>[]): readonly Extension<unknown>[] {
    return extensoesInstaladas.filter(ext =>
      this._avaliadores.some(av => av.ehConflitante(ext))
    );
  }
}
```

---

## 4. Map Lookup

### Quando usar

- Chave dinâmica (string em runtime) seleciona ação ou valor.
- Lista de opções pode crescer por configuração, não por código.

```typescript
// CORRETO — roteamento por chave com Map
const SCHEMAS_POR_EXTENSAO = new Map<string, string>([
  ['.github/workflows', 'https://json.schemastore.org/github-workflow.json'],
  ['docker-compose',    'https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json'],
]);

function obterSchemaPorNomeArquivo(nomeArquivo: string): string | undefined {
  for (const [padrao, uri] of SCHEMAS_POR_EXTENSAO) {
    if (nomeArquivo.includes(padrao)) {
      return uri;
    }
  }
  return undefined;
}
```

---

## 5. Operador Ternário

### Quando usar

- Apenas 1 condição com 2 resultados curtos.
- Expressão continua legível sem aninhamento.

```typescript
// CORRETO — condição simples
const statusLabel: string = perfil.habilitado ? 'ativo' : 'inativo';

// CORRETO — atribuição curta em duas linhas
const labelAcesso: string = resultado.permitido
  ? 'schema aplicado'
  : `schema ignorado: ${resultado.motivo}`;

// ERRADO — ternário aninhado
const nivel = perfil.habilitado
  ? (perfil.indentacao > 2 ? 'largo' : 'estreito')
  : (perfil.herdar ? 'herdado' : 'padrao');
```

---

## 6. Nullish Coalescing (`??`)

### Quando usar

- Valor padrão para possível `null`/`undefined`.
- Inicialização lazy.

```typescript
// CORRETO — fallback direto
const indentacao: number = perfilProjeto?.indentacao ?? configuracao.get('yaml.format.indent', 2);

// CORRETO — fallback em cadeia
const uriWorkspace: string = workspace.workspaceFolders?.[0]?.uri.toString() ?? '';

// ERRADO — if manual para fallback trivial
let indentacao: number;
if (perfilProjeto?.indentacao === undefined) {
  indentacao = 2;
} else {
  indentacao = perfilProjeto.indentacao;
}
```

---

## 7. Optional Chaining (`?.`)

### Quando usar

- Acesso seguro em cadeia com possíveis valores nulos.
- Evitar árvore de `if (x !== null)`.

```typescript
// CORRETO — navegação segura
const primeiraUri: Uri | undefined = workspace.workspaceFolders?.[0]?.uri;
const nomeArquivo: string | undefined = textEditor?.document?.fileName;

// ERRADO — if aninhado para acesso nulo simples
let uri: Uri | undefined;
if (workspace.workspaceFolders !== undefined) {
  if (workspace.workspaceFolders.length > 0) {
    if (workspace.workspaceFolders[0] !== undefined) {
      uri = workspace.workspaceFolders[0].uri;
    }
  }
}
```

---

## 8. Guard Clauses (Early Return)

### Quando usar

- Validação de entrada no início.
- Falha rápida para evitar aninhamento.

```typescript
// CORRETO — guard clauses no topo
async resolverPerfilEfetivoAsync(
  requisicao: ResolverPerfilRequisicao,
  ct: CancellationToken
): Promise<PerfilFormatacaoResposta> {
  if (!requisicao.uriDocumento) {
    throw new EntradaInvalidaExcecao('URI do documento é obrigatória.');
  }

  const pastas = workspace.workspaceFolders;
  if (!pastas || pastas.length === 0) {
    return this._construirPerfilPadrao();
  }

  const perfilProjeto: PerfilFormatacao | undefined =
    await this._repositorioPerfil.obterAsync(requisicao.uriDocumento, ct);

  if (!perfilProjeto) {
    return this._resolverPorConfiguracoes(ct);
  }

  return this._mapeador.paraResposta(perfilProjeto);
}

// ERRADO — validação enterrada em blocos aninhados
async resolverPerfilEfetivoAninhado(...): Promise<PerfilFormatacaoResposta> {
  if (requisicao.uriDocumento) {
    const pastas = workspace.workspaceFolders;
    if (pastas && pastas.length > 0) {
      const perfil = await this._repositorioPerfil.obterAsync(requisicao.uriDocumento, ct);
      if (perfil) {
        return this._mapeador.paraResposta(perfil);
      }
    }
  }
  return this._construirPerfilPadrao();
}
```

---

## 9. `if` — Sinal de Alerta

Se você chegou até aqui, pare e reavalie. Antes de escrever `if`, responda:

- Existe um mapeamento `Record` que substitui isso?
- Existe um `switch` exaustivo aplicável?
- Posso modelar isso como estratégia ou polimorfismo?
- É apenas um fallback de `null`/`undefined`? → use `??` ou `?.`
- É validação de entrada? → use guard clause (nível 8)

Se nenhuma alternativa se aplica e o bloco exige múltiplos side-effects sem
outra estrutura possível, `if` com chaves é permitido. Mas isso deve ser raro.

```typescript
// Exemplo de caso genuíno — fluxo com side-effect sem alternativa declarativa
if (ct.isCancellationRequested) {
  this._logger.appendLine('Operação cancelada pelo usuário.');
  return;
}
```

Se `if` aparecer com frequência em um arquivo, é sinal de que há
oportunidade de refatoração — não de estilo, mas de modelagem.

---

## Árvore de Decisão Rápida

```text
CONDICIONAIS

Precisa mapear valor → resultado fixo?
→ Objeto de mapeamento (Record)

Precisa cobrir todos os casos de um enum/union?
→ switch exaustivo com never

Cada variante tem lógica própria e tende a crescer?
→ Estratégia / Polimorfismo

Precisa rotear chave dinâmica?
→ Map lookup

É só uma atribuição condicional curta?
→ Operador Ternário

Precisa fallback para null/undefined?
→ Nullish Coalescing (??)

Precisa navegação segura em objeto anulável?
→ Optional Chaining (?.)

Precisa validar entrada e interromper cedo?
→ Guard Clauses

Nada acima resolve e há side-effect?
→ if com chaves
```

---

## PARTE 2 — Iteração (Arrays e Coleções)

### Hierarquia de Preferência — Iteração

1. **Array methods (`.filter()`, `.map()`, `.find()`)** — projeção, filtragem, verificação.
2. **Array de agregação (`.reduce()`, `.some()`, `.every()`)** — cálculo e verificação global.
3. **`for...of` declarativo** — side-effects necessários no loop.
4. **`for` indexado** — apenas quando o índice participa da regra.

### I1. Array Methods — Projeção, Filtragem e Verificação

```typescript
// CORRETO — filtrar e projetar de forma declarativa
obterUrisDocumentosAtivos(documentos: readonly TextDocument[]): readonly string[] {
  return documentos
    .filter(doc => doc.languageId === 'yaml')
    .map(doc => doc.uri.toString());
}

// CORRETO — verificação objetiva
temDocumentoYamlAberto(documentos: readonly TextDocument[]): boolean {
  return documentos.some(doc => doc.languageId === 'yaml');
}

// ERRADO — loop imperativo para operação de consulta
obterUrisDocumentosAtivosImperativo(documentos: readonly TextDocument[]): string[] {
  const uris: string[] = [];
  for (const doc of documentos) {
    if (doc.languageId === 'yaml') {
      uris.push(doc.uri.toString());
    }
  }
  return uris;
}
```

### I2. `for...of` — Side-Effects

```typescript
// CORRETO — side-effect explícito por item
async notificarClientesAsync(
  uris: readonly string[],
  ct: CancellationToken
): Promise<void> {
  for (const uri of uris) {
    await this._clienteLsp.enviarNotificacaoAsync(uri, ct);
  }
}
```

### I3. `for` Indexado — Quando o Índice Participa da Regra

```typescript
// CORRETO — índice na regra de negócio
function numerarPerfis(perfis: PerfilFormatacao[]): void {
  for (let i = 0; i < perfis.length; i++) {
    perfis[i].ordemPrecedencia = i + 1;
  }
}
```

---

## Proibições Absolutas

- **`if` sem chaves:** risco alto de erro em manutenção.
- **Ternário aninhado 3+ níveis:** usar objeto de mapeamento ou switch.
- **Loop manual para consulta de array:** usar array methods.
- **`for...in` em arrays:** iterage sobre propriedades, não valores.

---

## Checklist de Controle de Fluxo

- [ ] A hierarquia 1 → 9 foi respeitada nesta decisão?
- [ ] Mapeamentos de valores usam objeto `Record` ou `Map`?
- [ ] switch cobre todos os casos com `never` no `default`?
- [ ] Ternário aplicado só em condições curtas?
- [ ] `??` e `?.` usados para null/undefined?
- [ ] Guard clauses estão no topo do método?
- [ ] `if` com chaves ficou restrito a último recurso?
- [ ] Consulta de array usa array methods (não loop manual)?
- [ ] `for...of` reservado para side-effects reais?
- [ ] Sem `if` sem chaves?

---

**Próximo:** [Nomenclatura →](NOMENCLATURA.md)
